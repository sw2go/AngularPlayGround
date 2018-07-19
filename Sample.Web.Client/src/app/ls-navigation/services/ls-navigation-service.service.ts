import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterEvent, NavigationEnd, NavigationStart, UrlSegment } from '@angular/router';
import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { map, filter, pairwise, takeUntil } from 'rxjs/operators';
import { FragmentInterface } from '../models/fragment.interface';
import { LinkInterface } from '../models/link.interface';
import { Target } from '../models/target';
import { LsNavigationConfigService } from './ls-navigation-config.service';
import { LsNavigationConfigInterface } from '../models/ls-navigation-config.interface';

// Attention: ActivatedRoute is only usable in Components but not in a service !!!


@Injectable()
export class LsNavigationService implements OnDestroy  {

  private destroy$ = new Subject();                             // to properly terminate Observables ( avoid memory leaks )
  private navtarget: Target;                                    // class keeping current navigation target position  
  private navurlpath: string = "";                              // last navigated urlpath ( without params and/or fragment )
  //private muteNavigationEvents: boolean = false;


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
    filter((event: RouterEvent) => { return (event instanceof NavigationEnd);}),
    map((event: RouterEvent) => { return event.url }),
    takeUntil(this.destroy$)  
  )




  private scrollend$ = interval(200)                            // Observable with a Samplerate
  .pipe(
    map(() => window.pageYOffset),                              // sample value = page Y Offset
    pairwise(), map((e) => { 
      return {diff: e[0] - e[1], pos: e[1]}                     // get diff and pos 
    }),                  
    pairwise(), 
    filter((e) => e[0].diff != 0 && e[1].diff == 0),
    takeUntil(this.destroy$)       
  ) 

  private sbn: Subscription = null;                         // Subscription to allow unsubscribe at scrollend

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
            else { //if (this.navtarget.Position == Math.round(e[0].pos))   // unbedingtes unsubscribe damit, falls die Zielposition nicht erreicht werden kann,
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
      if (e[0]) { e[0].showAsActive = false; }                    // set previous inactive ( only initial value is null )
      if (e[1]) { 
        e[1].showAsActive = true;                                 // set current active
        
        console.log(">>>>" + e[1].getUrl());
        
        //if (!this.ScrollByNavigation) {                         // TODO besser beschreiben warum es keine Option ist:
        //  this.muteNavigationEvents = true;                     // man kann trotz router-update auf der seite ein detailelement einer anderen Seite klicken
        //  this.router.navigateByUrl(e[1].getUrl());             // was dann zu z.B. /SE not found führen kann wenn SE geklickt wird während man noch im start-screen ist
        //  console.log(">>>>" + e[1].getUrl());
        //}
        this.location.go(e[1].getUrl());                          // update url in browser
      }                                   
      
    });
    
    this.showActiveSubject.next(null);                            // emit initial dummy value null to get a change when first real value arrives 

    this.scrollmanual$.subscribe(position =>{ 
      console.log("scroll-man " + position);

      for (let i=this.pageFragments.length - 1; i >= 0; i-- ) {
        if (position >= this.pageFragments[i].getOffsetTop() + this.config.headerOffset) {
          // we found a matching fragment - now try to find a matching routerlink           
        
          let lnk: LinkInterface = this.config.useFragments
            ? ( (this.pageFragments[i].getId()==null)
            ? this.menuLinks.find(x => x.getUrl() == this.navurlpath)
            : this.menuLinks.find(x => x.getUrl() == this.navurlpath + "#" + this.pageFragments[i].getId()) )
            : ( (this.pageFragments[i].getId()==null)
            ? this.menuLinks.find(x => x.getUrl() == "/")
            : this.menuLinks.find(x => x.getUrl() == "/" + this.pageFragments[i].getId()) )

          if (lnk != null) { // if found return link - otherwise continue loop   
            this.showActiveSubject.next(lnk);
            return;
          }
        }
      }
      this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == this.navurlpath));
    });

    this.routerNavigationStart$.subscribe((url: string) => { 

      //if (this.muteNavigationEvents)
      //  return;
      
      //this.SetScrollByNavigation(true);
    });

    this.routerNavigationEnd$.subscribe( (url: string) => { 
    
    //this.routerNavEnd$.subscribe( (urlseg: UrlSegment[]) => {
    //  let url: string = urlseg.map(x => x.path).join("/");

    // if (this.muteNavigationEvents) {
     //   this.muteNavigationEvents = false;
     //   return;
     // }
     this.SetScrollByNavigation(true);
      

      this.navurlpath = /[^#?]+/.exec(url)[0]; // path only ( without param and fragment )

      let fx = url.lastIndexOf('#')
      let navurlpathwithfragment = (fx>0) ? this.navurlpath + url.substr(fx) : this.navurlpath;
    





      console.log("navurlpath " + this.navurlpath);
      console.log("pathWithfragment " + navurlpathwithfragment);
  
      if (this.pageFragments.length > 0) {
        
        this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == navurlpathwithfragment));

        if (this.config.useFragments)
          this.navtarget.Set(this.pageFragments.find(element => navurlpathwithfragment.endsWith("#" + element.getId()) ));
        else
          this.navtarget.Set(this.pageFragments.find(element => navurlpathwithfragment.endsWith("/" + element.getId()) ));
        
        if (!this.navtarget.IsFragment)
          this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == this.navurlpath));
   
        if (window.pageYOffset == this.navtarget.Position)  // wenn wir schon da sind  
          this.SetScrollByNavigation(false);                // Abbruch - kein Scroll nötig
        else 
          this.navtarget.ScrollToPosition();        
      }
    });   
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  /**
   * List for Directives referencing RouterLink's in Menu and Fragments on Pages  
   */

  private menuLinks: Array<LinkInterface> = [];
  private pageFragments: Array<FragmentInterface> = [];

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

  public addFragment(item: FragmentInterface) {
    if (!this.pageFragments.some(function(i) { return i.getId() == item.getId();})) {
      this.pageFragments.push(item);
      console.log("add frag " + item.getId());
    }
  }

  public removeFragment(item: FragmentInterface) {
    let found: number = this.pageFragments.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.pageFragments.splice(found,1); 
      console.log("del frag " + item.getId())
    } 
  }
}
