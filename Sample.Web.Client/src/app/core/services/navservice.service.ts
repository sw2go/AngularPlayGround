import { Injectable} from '@angular/core';
import { Router, RouterEvent, NavigationEnd, UrlTree, NavigationStart, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, pipe, Subject } from 'rxjs/Rx';
import { Location  } from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, distinct, filter, pairwise } from 'rxjs/operators';


// TODO click auf ABOUT3 dann page reload und dann manuell scrollen sollte gehen


export interface INavRouterLink {
  getUrl(): string;
  getRouterLink(): string; 
  getFragment(): string;
  showAsActive: boolean;
}

export interface INavFragment {
  getId(): string; 
  getOffsetTop(): number;
}

class Target {
  private fragment: INavFragment;
  private offset: number;
  public Position: number;
  constructor(offset: number) {
    this.offset = offset; 
  }

  public Set(fragment : INavFragment) {
    this.fragment = fragment;
    this.Position = (fragment) ? fragment.getOffsetTop() + this.offset : 0;
  }
  
  public get IsFragment() : boolean {
    return (this.fragment!=null);
  }
  public ScrollToPosition() {
    setTimeout(() => {      
      console.log("scrollto:" + this.Position );
      window.scroll({behavior: 'smooth', top:this.Position}); 
    },0);
  }

  public get PositionHasChanged() : boolean {
    if (this.IsFragment) {
      let p = this.fragment.getOffsetTop() + this.offset;
      if (p != this.Position) {
        this.Position = p;
        return true;
      }
      return false;
    }
  }
}


@Injectable()
export class NavService {

  // get header-offset = navbar height = marginTop of body ( defined at a single place - see styles.scss )
  private headerOffset: number = -parseInt(window.getComputedStyle(document.body).marginTop, 10);

  // class keeping current navigation target position
  private navtarget = new Target(this.headerOffset);

  // last navigated urlpath ( without params and/or fragment )
  private urlpath: string = "";

  // Subject for activeRouterLink triggered in NavigationEnd and Current
  private showActiveSubject = new Subject<INavRouterLink>();  
  private $showActiv = this.showActiveSubject               // show
  .pipe(                                                    // NavRouterLink
    pairwise(), filter(e => e[0] != e[1])                   // trigger on change only    
  )             

  public $gaggi = this.showActiveSubject.asObservable();

  // Status "ScrollByNavigation" 
  // ---------------------------

  private scrollend$ = Observable.interval(200)             // Samplerate
  .pipe(
    map(() => window.pageYOffset),                          // sample value = page Y Offset
    pairwise(), map((e) => { 
      return {diff: e[0] - e[1], pos: e[1]}                 // get diff and pos 
    }),                  
    pairwise(), 
    filter((e) => e[0].diff != 0 && e[1].diff == 0)
  )                 
                                  
  private sbn: Subscription = null;                         // Subscription to allow unsubscribe at scrollend

  public get ScrollByNavigation() : boolean {               
    return (this.sbn != null && !this.sbn.closed);
  }

  private SetScrollByNavigation(on: boolean) {
    if (!this.ScrollByNavigation) {
      if (on) {
        this.sbn = this.scrollend$.subscribe((e) =>{ 
          console.log("scroll-end diff:" + e[0].diff + " pos:" + Math.round(e[0].pos));
            if (this.navtarget.PositionHasChanged)
              this.navtarget.ScrollToPosition();
            else if (this.navtarget.Position == Math.round(e[0].pos))
              this.sbn.unsubscribe();
        });
      }
    }
    else if (!on) {
      console.log("scroll-unsub");
      this.sbn.unsubscribe();
    }
  }


  constructor(private router: Router, private location: Location, private activatedRoute: ActivatedRoute) { 

    // default ist 'ignore', 'reload' damit nach click auf "A" und scroll nach "B" ein click auf "A" nicht ignoriert wird   
    this.router.onSameUrlNavigation = 'reload';

    console.log("header top:" + this.headerOffset)
  
    this.$showActiv.subscribe( e => {
      if (e[0]) { e[0].showAsActive = false; }                    // set previous inactive ( only initial value is null )
      e[1].showAsActive = true;                                   // set current active
      this.location.go(e[1].getUrl());                            // update url in browser
    });
    this.showActiveSubject.next(null);                            // emit initial dummy value null to get a change when first real value arrives 

    Observable.fromEvent(window,"scroll").pipe(                   // 1. window-scroll event
      map(()=> window.pageYOffset),                               // 2. map y-offset only 
      filter(e => !this.ScrollByNavigation)                       // 3. filter "manual scroll only" 
    ).subscribe(e =>{ 
      console.log("scroll-man " + e);
      this.Current(e);
    });

    router.events.pipe( // On NavigationStart -> Begin of "Scroll by Navigation"
      filter((event: RouterEvent) => { return (event instanceof NavigationStart);}),
      map((event: RouterEvent) => { return event.url })
    ).subscribe((url: string) => { 
      this.SetScrollByNavigation(true);
    });

    router.events.pipe( // On NavigationEnd
      filter((event: RouterEvent) => { return (event instanceof NavigationEnd);}),
      map((event: RouterEvent) => { return event.url })
    ).subscribe( (url: string) => { 

      let up: string = /[^#?]+/.exec(url)[0]; // path only ( without param and fragment )
      let pagereload = up != this.urlpath;
      this.urlpath = up;

      console.log("path " + this.urlpath);
  
      let scrollToPosition = 0;     // default = top

      if (this.pageFragments.length > 0) {
        
        this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == url));
        this.navtarget.Set(this.pageFragments.find(element => url.endsWith("#" + element.getId()) ));

        if (!this.navtarget.IsFragment)
          this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == this.urlpath));
   
        if (window.pageYOffset == this.navtarget.Position) {
          this.SetScrollByNavigation(false);
        }          
        else {
          this.navtarget.ScrollToPosition();
        }
      }
    });   
  }

  public Current(position:number) {
    for (let i=this.pageFragments.length - 1; i >= 0; i-- ) {
      if (position >= this.pageFragments[i].getOffsetTop() + this.headerOffset) {
        // we found a matching fragment - now try to find a matching routerlink 
        let lnk: INavRouterLink = (this.pageFragments[i].getId()==null) 
          ? this.menuLinks.find(x => x.getUrl() == this.urlpath)
          : this.menuLinks.find(x => x.getUrl() == this.urlpath + "#" + this.pageFragments[i].getId()); 

        if (lnk != null) { // if found return link - otherwise continue loop   
          this.showActiveSubject.next(lnk);
          return;
        }
      }
    }
    this.showActiveSubject.next(this.menuLinks.find(x => x.getUrl() == this.urlpath));
  }
 
  /**
   * List for Directives referencing RouterLink's in Menu and Fragments on Pages  
   */

  private menuLinks: Array<INavRouterLink> = [];
  private pageFragments: Array<INavFragment> = [];

  public addLink(item: INavRouterLink) {
    if (!this.menuLinks.some(function(i) {return i.getUrl() == item.getUrl();})) {
      this.menuLinks.push(item);
      console.log("add link " + item.getUrl() );
    }
  }

  public removeLink(item: INavRouterLink) {
    let found: number = this.menuLinks.findIndex(i => i.getUrl() == item.getUrl());
    if (found>=0) {
      this.menuLinks.splice(found,1); 
      console.log("del link " + item.getUrl() );
    } 
  }

  public addFragment(item: INavFragment) {
    if (!this.pageFragments.some(function(i) { return i.getId() == item.getId();})) {
      this.pageFragments.push(item);
      console.log("add frag " + item.getId());
    }
  }

  public removeFragment(item: INavFragment) {
    let found: number = this.pageFragments.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.pageFragments.splice(found,1); 
      console.log("del frag " + item.getId())
    } 
  }
}


