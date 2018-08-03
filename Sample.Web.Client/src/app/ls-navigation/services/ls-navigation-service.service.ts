import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterEvent, NavigationEnd, NavigationStart, UrlSegment, NavigationCancel, NavigationError } from '@angular/router';
import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { map, filter, pairwise, takeUntil, delayWhen } from 'rxjs/operators';
import { SectionInterface } from '../models/section.interface';
import { LinkInterface } from '../models/link.interface';
import { Target } from '../models/target';
import { LsNavigationConfigService } from './ls-navigation-config.service';
import { LsNavigationConfigInterface } from '../models/ls-navigation-config.interface';
import { timer } from '../../../../node_modules/rxjs/observable/timer';

// Attention: ActivatedRoute is only usable in Components but not in a service !!!


@Injectable()
export class LsNavigationService implements OnDestroy  {

  private destroy$ = new Subject();                             // to properly terminate Observables ( avoid memory leaks )
  private navtarget: Target;                                    // class keeping current navigation target position  
  private navurlpath: string = "";                              // last navigated urlpath ( without params and/or fragment )
  private muteNavigationEvents: number = 0;                     // only used when this.config.updateRouterOnManualScroll = true

  // Subject for active Link Display ( triggered by either "manualscroll$" or "routerNavigationEnd$" )
  private showActiveSubject = new Subject<LinkInterface>();  
  private showActiv$ = this.showActiveSubject                   // show
  .pipe(                                                        // NavRouterLink
    pairwise(), 
    filter(e => e[0] != e[1]),                                  // trigger on change only  
    takeUntil(this.destroy$)  
  )             

  private scrollmanual$ = fromEvent(window,"scroll")            // Observable for window scroll event
  .pipe(                                                        
    map(()=> window.pageYOffset),                               // 1. map y-offset only 
    filter(e => !this.ScrollByNavigation),                      // 2. filter "manual scroll only" 
    takeUntil(this.destroy$)                                    // 3. clean up
  )

  private routerNavigationStart$ = this.router.events           // Observable for router event
  .pipe( 
    filter((event: RouterEvent) => { return (event instanceof NavigationStart);}),
    map((event: RouterEvent) => { return event.url }),
    takeUntil(this.destroy$)  
  )

  private routerNavigationEnd$ = this.router.events             // Observable for router event
  .pipe(
    filter((event: RouterEvent) => { return (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError);}),
    map((event: RouterEvent) => { return { url: event.url, cancel: !(event instanceof NavigationEnd) } }),
    delayWhen(() => timer(0)),                                  // delay to ensure "add section" happens before routerNavigationEnd
    takeUntil(this.destroy$)  
  )

  private scrollend$ = interval(50)                             // Observable with a short Samplerate ( 200 war zu kurz wenn man nur wenig scrollt und dann wieder Menu klickt )
  .pipe(
    map(() => window.pageYOffset),                              // sample value = page Y Offset
    pairwise(), map((e) => { 
      return {diff: e[0] - e[1], pos: e[1]}                     // get diff and pos 
    }),                  
    pairwise(), 
    filter((e) => e[0].diff != 0 && e[1].diff == 0),
    takeUntil(this.destroy$)       
  ) 

  private sbn: Subscription = null;                             // Subscription, to have a object for unsubscribing at scrollend

  public get ScrollByNavigation() : boolean {               
    return (this.sbn != null && !this.sbn.closed);
  }

  private SetScrollByNavigation(on: boolean) {
    if (!this.ScrollByNavigation) {
      if (on) {
        console.log("scrollbynav-sub");
        this.sbn = this.scrollend$.subscribe((e) =>{ 
          console.log("scroll-end diff:" + e[0].diff + " pos:" + Math.round(e[0].pos));
            if (this.navtarget.PositionHasChanged)
              this.navtarget.ScrollToPosition();
            else { //if (this.navtarget.Position == Math.round(e[0].pos))     // unbedingtes unsubscribe damit, falls die Zielposition nicht erreicht werden kann,
              console.log("scrollbynav-unsub");                               // trotzdem wieder "manuell" scrolling geht
              this.sbn.unsubscribe();    
            }                                  
        });
      }
    }
    else if (!on) {
      console.log("scroll-unsub");
      this.sbn.unsubscribe();
    }
  }

  constructor(private router: Router, private location: Location,
    @Inject(LsNavigationConfigService) private config: LsNavigationConfigInterface) {
      
    this.navtarget = new Target(this.config.headerOffset);

    // default ist 'ignore', 'reload' damit nach click auf "A" und scroll nach "B" ein click auf "A" nicht ignoriert wird   
    this.router.onSameUrlNavigation = 'reload';

    console.log("header top:" + this.config.headerOffset)
  
    this.showActiv$.subscribe( e => {

      // Update active Status in Menu
      if (e[0]) { 
        e[0].showAsActive = false;                              // set previous inactive ( only initial value is null )
      }                    
      if (e[1]) { 
        e[1].showAsActive = true;                               // set current active

        // Update URL 
        if (!this.config.updateRouterOnManualScroll) {
          this.location.go(e[1].getUrl());                      // update url in browser only
        }
        else if (!this.ScrollByNavigation) {                    // TODO besser beschreiben warum es keine Option ist:
          this.muteNavigationEvents++;                          // man kann trotz router-update auf der seite ein detailelement einer anderen Seite klicken
          this.router.navigateByUrl(e[1].getUrl());             // was dann zu z.B. /SE not found führen kann wenn SE geklickt wird während man noch im start-screen ist
        }        
      }                                         
    });
    
    this.showActiveSubject.next(null);                            // emit initial dummy value null to get a change when first real value arrives 

    this.scrollmanual$.subscribe(position =>{     
      for (let i=this.pageSections.length - 1; i >= 0; i-- ) {
        if (position >= this.pageSections[i].getOffsetTop() + this.config.headerOffset) {
          console.log("scroll-man: " + position + " -> section: " + this.pageSections[i].getId() );
          // we found a matching fragment - now try to find a matching routerlink           
          
          let lnk: LinkInterface = null;

          if (this.config.useFragments) {
            if (this.pageSections[i].getId()==null)
              lnk = this.menuLinks.find(x => x.getUrl() == this.navurlpath);
            else
              lnk = this.menuLinks.find(x => x.getUrl() == this.navurlpath + "#" + this.pageSections[i].getId());
          }
          else {
            if (this.pageSections[i].getId()==null)
              lnk = this.menuLinks.find(link => link.getUrl() == "/");
            else
              //lnk = this.menuLinks.find(link => link.getUrl() == "/" + this.pageSections[i].getId());
              lnk = this.menuLinks.find(link => this.pageSections[i].match(link.getUrl()));
          }

          if (lnk != null) { // if found return link - otherwise continue loop   
            this.showActiveSubject.next(lnk);
            //console.log("scroll-man " + position + " section: " +  this.pageSections[i].getId() + " link: " + lnk.getUrl()  );

            return;
          }
          else {
            //console.log("scroll-man " + position + " section: " +  this.pageSections[i].getId() + " no link" );
          }
        }
      }
      console.log("scroll-man: " + position + " -> no section found");
      this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == this.navurlpath));
    });

    this.routerNavigationStart$.subscribe((url: string) => { 

      if (this.muteNavigationEvents === 0)
        this.SetScrollByNavigation(true);     // set early -> to avoid occasional "manual-scroll" event at begin of navigation    

    });

    this.routerNavigationEnd$.subscribe( (e) => { 
    
      if (this.config.updateRouterOnManualScroll && this.muteNavigationEvents > 0) {
        this.muteNavigationEvents--;
      }
      else if (e.cancel) {  // NavigationCancel or NavigationError
        this.SetScrollByNavigation(false); 
      }
      else {                // NavigationEnd
                
        this.navurlpath = /[^#?]+/.exec(e.url)[0]; // path only ( without param and fragment )

        let fx = e.url.lastIndexOf('#')
        let navurlpathwithfragment = (fx>0) ? this.navurlpath + e.url.substr(fx) : this.navurlpath;
      
        console.log("pathWithfragment " + navurlpathwithfragment);
    
        //if (this.pageSections.length > 0) {  // nicht nötig da 

        // for the current navurl find the best matching (longest) routerlink  
        let lnk = this.menuLinks.find(link => link.getUrl() == navurlpathwithfragment);
        if (!lnk && this.config.activeLinkDisplayPartialMatch) {
          let partialMatches: LinkInterface[] = this.menuLinks.filter(link => link.getUrl().length > 1 && navurlpathwithfragment.startsWith(link.getUrl()));
          partialMatches.sort((link1, link2) => { return link1.getUrl().length - link2.getUrl().length }); // longes first
          if (partialMatches.length >0 )
            lnk = partialMatches[0];        
        }
        // and display link as "active"
        this.showActiveSubject.next(lnk);

        // 

        //if (this.config.useFragments)
        //  this.navtarget.Set(this.pageSections.find(section => navurlpathwithfragment.endsWith("#" + section.getId()) ));
        //else
        //  this.navtarget.Set(this.pageSections.find(element => navurlpathwithfragment.endsWith("/" + element.getId()) ));

        console.log("find section(url):" + navurlpathwithfragment);
        this.navtarget.Set(this.pageSections.find(section => section.match(navurlpathwithfragment)));
                  
        if (!this.navtarget.IsSection)
          this.showActiveSubject.next(this.menuLinks.find(link => link.getUrl() == this.navurlpath));
   
        if (window.pageYOffset == this.navtarget.Position)  // wenn wir schon da sind  
          this.SetScrollByNavigation(false);                // Abbruch - kein Scroll nötig
        else 
          this.navtarget.ScrollToPosition();        
     // }
      }
    });   
/*
    this.routerNavigationCancel$.subscribe((e) => {

      if (this.config.updateRouterOnManualScroll && this.muteNavigationEvents > 0) {
        this.muteNavigationEvents--;
        return;
      }

      this.SetScrollByNavigation(false); 
    });
    */
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  public get Config() {
    return this.config;
  }


  /**
   * List for Directives referencing RouterLink's in Menu and Sections on Pages  
   */

  private menuLinks: Array<LinkInterface> = [];
  private pageSections: Array<SectionInterface> = [];

  public addLink(item: LinkInterface) {
    if (!this.menuLinks.some(function(i) {return i.getUrl() == item.getUrl();})) {
      this.menuLinks.push(item);
      console.log("add link " + item.getUrl() );
    }
  }

  public removeLink(item: LinkInterface) {
    let found: number = this.menuLinks.findIndex(i => i.getUrl() == item.getUrl());
    if (found>=0) {
      this.menuLinks.splice(found,1); 
      console.log("del link " + item.getUrl() );
    } 
  }

  public addSection(item: SectionInterface) {
    if (!this.pageSections.some(function(i) { return i.getId() == item.getId();})) {
      this.pageSections.push(item);
      console.log("add section " + item.getId());
    }
  }

  public removeSection(item: SectionInterface) {
    let found: number = this.pageSections.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.pageSections.splice(found,1); 
      console.log("del section " + item.getId())
    } 
  }
}
