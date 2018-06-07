import { Injectable} from '@angular/core';
import { Router, RouterEvent, NavigationEnd, UrlTree, NavigationStart, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, pipe } from 'rxjs/Rx';
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

@Injectable()
export class NavService {

  // maybe read from somewhere 
  private headerOffset: number = -56;

  // last navigated urlpath ( without params and/or fragment )
  private urlpath: string = "";

  // Status "ScrollByNavigation" 
  // ---------------------------

  private scrollend$ = Observable.interval(100)                 // Samplerate
  .map(() => window.pageYOffset)                                // sample value
  .pairwise().map((e) => e[0] - e[1])                           // f(x)'
  .pairwise().filter(e => e[0] != 0 && e[1] == 0)               // negative edge

  private sbn: Subscription = null;

  public get ScrollByNavigation() : boolean {
    return (this.sbn != null && !this.sbn.closed);
  }

  private SetScrollByNavigation(on: boolean) {
    if (!this.ScrollByNavigation) {
      if (on) {
        this.sbn = this.scrollend$.subscribe(e =>{ 
          console.log("scroll-end " + e[0]);
          this.sbn.unsubscribe();
        });
      }
    }
    else if (!on)
      this.sbn.unsubscribe();
  }


  constructor(private router: Router, private location: Location, private activatedRoute: ActivatedRoute) { 

    // default ist 'ignore', 'reload' damit nach click auf "A" und scroll nach "B" ein click auf "A" nicht ignoriert wird   
    this.router.onSameUrlNavigation = 'reload';

    console.log("body margin Top=" + window.getComputedStyle(document.body).marginTop);


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

      this.urlpath = /[^#?]+/.exec(url)[0]; // path only ( without param and fragment )

      console.log("path " + this.urlpath);
  
      let scrollToPosition = 0;     // default = top

      if (this.pageFragments.length > 0) {
        
        this.showAsActive(this.menuLinks.find(x => x.getUrl() == url));
        
        let foundFragment: INavFragment = this.pageFragments.find(element => url.endsWith("#" + element.getId()) );          
        if (foundFragment)          
          scrollToPosition = foundFragment.getOffsetTop() + this.headerOffset;
      }
      else {
        this.showAsActive(this.menuLinks.find(x => x.getUrl() == this.urlpath));
      }
      
      if ( window.pageYOffset == scrollToPosition) {
        this.SetScrollByNavigation(false);
      }          
      else {
        setTimeout(() => {
          console.log("scroll-sta " + window.pageYOffset);
          window.scroll({behavior: 'smooth', top: scrollToPosition});
        }, 1);  // 1 ms = wait-time, just to make it async
      }

    });   
  }

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

  private previous: INavRouterLink = null; 
  private showAsActive(current: INavRouterLink) {

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


