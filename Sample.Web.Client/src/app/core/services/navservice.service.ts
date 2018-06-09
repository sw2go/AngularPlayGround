import { Injectable} from '@angular/core';
import { Router, RouterEvent, NavigationEnd, UrlTree, NavigationStart, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, pipe, Subject } from 'rxjs/Rx';
import { Location  } from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, debounceTime, distinct, filter, pairwise } from 'rxjs/operators';


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

  // get header-offset = navbar height = marginTop of body ( see styles.scss )
  private headerOffset: number = -parseInt(window.getComputedStyle(document.body).marginTop, 10);

  private tg = new Target(this.headerOffset);

  // last navigated urlpath ( without params and/or fragment )
  private urlpath: string = "";

  // Subject for activeRouterLink triggered in NavigationEnd and Current
  private showActiveSubject = new Subject<INavRouterLink>();  
  private $showActiv = this.showActiveSubject               // show
  .pipe( 
    pairwise(), filter(e => e[0] != e[1])                   // change only    
  )             

  public $gaggi = this.showActiveSubject.asObservable();

  // Status "ScrollByNavigation" 
  // ---------------------------

  private scrollend$ = Observable.interval(200)             // Samplerate
  .pipe(
    map(() => window.pageYOffset),                          // sample value
    pairwise(), map((e) => { 
       /*
      if (this.target) {
        if ( this.target.getOffsetTop() + this.headerOffset != this.targetpos) {
        console.log("rescroll " + (this.target.getOffsetTop() + this.headerOffset) + " " + this.targetpos);
        this.scrollToTarget();    // rescroll da in der zwischenzeit das fragment eine andere position hat
        }
      } */
      return {diff: e[0] - e[1], y:e[1]} 
    
    } ),                  // f(x)'
    pairwise(), filter((e) => e[0].diff != 0 && e[1].diff == 0)         // negative edge  
  )                 
                                  
/*      
  private scrollend1$ = Observable.interval(100)            // Samplerate
  .map(() => window.pageYOffset)                            // sample value
  .pairwise().map((e) => e[0] - e[1])                           // f(x)'
  .pairwise().filter(e => e[0] != 0 && e[1] == 0)               // negative edge
*/

  private sbn: Subscription = null;

  public get ScrollByNavigation() : boolean {
    return (this.sbn != null && !this.sbn.closed);
  }

  private SetScrollByNavigation(on: boolean) {
    if (!this.ScrollByNavigation) {
      if (on) {
        this.sbn = this.scrollend$.subscribe((e) =>{ 
          console.log("scroll-end " + e[0].diff);
            if (this.tg.PositionHasChanged)
              this.tg.ScrollToPosition();
            else if (this.tg.Position == e[0].y)
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
    this.showActiveSubject.next(null);                          // emit initial value null

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
        
        this.showAsActive(this.menuLinks.find(x => x.getUrl() == url));
        this.tg.Set(this.pageFragments.find(element => url.endsWith("#" + element.getId()) ));

        if (!this.tg.IsFragment)
          this.showAsActive(this.menuLinks.find(x => x.getUrl() == this.urlpath));
/*
        this.target = this.pageFragments.find(element => url.endsWith("#" + element.getId()) );     
      if (this.target)          
          scrollToPosition = this.target.getOffsetTop() + this.headerOffset;
      }
      else {
        this.showAsActive(this.menuLinks.find(x => x.getUrl() == this.urlpath));
      }
  */    
        if (window.pageYOffset == this.tg.Position) {
          this.SetScrollByNavigation(false);
        }          
        else {
          this.tg.ScrollToPosition();
        //this.scrollToTarget();  // initial start of scroll by navigation
      /*
        setTimeout(() => {
          scrollToPosition = (foundFragment) ? foundFragment.getOffsetTop() + this.headerOffset : 0;

          console.log("scroll-sta " + window.pageYOffset + " to " +  scrollToPosition);
          if (foundFragment && foundFragment.getOffsetTop() !=  scrollToPosition)
          {
            console.log("ui " + foundFragment.getOffsetTop() );
          }
          window.scroll({behavior: 'smooth', top: scrollToPosition});   // instant smooth
        }, 50);  // 1 ms = wait-time, just to make it async

        */
      }
    }
    });   
  }

  /*
  private targetpos: number = 0;
  private target: INavFragment = null;
  private scrollToTarget() {
    this.targetpos = (this.target) ? this.target.getOffsetTop() + this.headerOffset : 0;
    setTimeout(() => {      
      window.scroll({behavior: 'smooth', top:this.targetpos}); 
    },0);
  }

*/

  public Current(position:number) {

  //  if (this.scrollByNavigation)
  //    return null;  // skip during scroll by navigation

    // update in case of manual scroll
    let p = -99;
    let o = -99;
    for (let i=this.pageFragments.length - 1; i >= 0; i-- ) {
      p = position;
      o = this.pageFragments[i].getOffsetTop();
      if (position >= this.pageFragments[i].getOffsetTop() + this.headerOffset) {
        // we found a matching fragment - now try to find a matching routerlink 
        let lnk: INavRouterLink = (this.pageFragments[i].getId()==null) 
          ? this.menuLinks.find(x => x.getUrl() == this.urlpath)
          : this.menuLinks.find(x => x.getUrl() == this.urlpath + "#" + this.pageFragments[i].getId()); 

        if (lnk != null)  // if found return link - otherwise continue loop   
          return this.showAsActive(lnk);
      }
    }
    return this.showAsActive(this.menuLinks.find(x => x.getUrl() == this.urlpath));
  }

  //private previous: INavRouterLink = null; 
  private showAsActive(current: INavRouterLink) {

    this.showActiveSubject.next(current);
    return;
/*
    if (this.previous != current) {

      if (this.previous != null) 
        this.previous.showAsActive = false;

      if(current != null) {
        current.showAsActive = true;
        this.location.go(current.getUrl());
      }
      this.previous = current;      
    }
    return current;
    */
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


