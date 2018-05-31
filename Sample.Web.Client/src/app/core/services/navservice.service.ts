import { Injectable, HostListener } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { Location  } from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
import { map, debounceTime, distinct } from 'rxjs/operators';

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

  private scrollByNavigation = false;
  //private previousNavScrollPos = -1;    // manual scrolling -1 , scroll caused by navigation >= 0
  private headerOffset: number = -56;

  //private sub: Subscription;

  //private url: string = "";
  private urlpath: string = "";

  private scrollpos$ = Observable.fromEvent(window, "scroll")  // create observable of window-scroll events
    .map(()=> window.window.pageYOffset);                      // map y-offset only 

  private scrollendpos$ = this.scrollpos$                         // create observable fireing only at scroll end
    .debounceTime(500);                          

  private manualScroll$ = this.scrollpos$
    .filter(e => !this.scrollByNavigation);

  constructor(private router: Router, private location: Location) { 

    // default ist 'ignore', 'reload' damit nach click auf "A" und scroll nach "B" ein click auf "A" nicht ignoriert wird   
    this.router.onSameUrlNavigation = 'reload';

    this.manualScroll$.subscribe(e =>{ 
      this.Current(e);
    });

    this.scrollendpos$.subscribe(e =>{ 
      console.log("jeah " + e);
      this.scrollByNavigation = false;
    });

    let navendurl$ = router.events
      .filter((event: RouterEvent) => {      
        return (event instanceof NavigationEnd);
    }).map((event: RouterEvent) => { return event.url });

    
    navendurl$.subscribe( (url: string) => { 
        
        this.urlpath = /[^#?]+/.exec(url)[0]; // path only ( no param and fragment )

        console.log("path " + this.urlpath);
   
        if (this.pageFragments.length > 0) {
          this.scrollByNavigation = true;
          this.showAsActive(this.menuLinks.find(x => x.getUrl() == url));
          let foundFragment: INavFragment = this.pageFragments.find(element => url.endsWith("#" + element.getId()) );
          let scrollToFragmentPosition = (foundFragment) ? foundFragment.getOffsetTop() + this.headerOffset : 0;

          setTimeout(() => {
            window.scroll({behavior: 'smooth', top: scrollToFragmentPosition});
          }, 250);  // 250 ms = wait-time
        }
        else {
          this.scrollByNavigation = true;
          this.showAsActive(this.menuLinks.find(x => x.getUrl() == this.urlpath));
        }     
    });
  }


  private menuLinks: Array<INavRouterLink> = [];

  private pageFragments: Array<INavFragment> = [];

  /** to add directive reference to service ( before any navigation happens )  
   * call add in constructor of the directive 
   **/
  public addFragment(item: INavFragment) {
    if (!this.pageFragments.some(function(i) { return i.getId() == item.getId();})) {
      this.pageFragments.push(item);
      console.log("add frag " + item.getId());
    }
  }

  /** to remove directive reference from service 
   * call remove in ngOnDestroy 
   **/
  public removeFragment(item: INavFragment) {
    let found: number = this.pageFragments.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.pageFragments.splice(found,1); 
      console.log("del frag " + item.getId())
    } 
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








  public scrollTo(url: string) {

  //  if (this.previousNavScrollPos = -1) {
    // if url ends with fragment (#)
  //    let foundFragment: INavFragment = this.pageFragments.find(element => url.endsWith("#" + element.getId()) );

    //  let scrollToFragmentPosition = (foundFragment) ? foundFragment.getOffsetTop() + this.headerOffset : 0;

    //  this.previousNavScrollPos = scrollToFragmentPosition;
      /*
      if (this.sub == null || this.sub.closed) {
        console.log("sub");
        this.sub = Observable.timer(1, 500).subscribe( tick => {
          let newpos: number = window.pageYOffset;
          if (this.previousNavScrollPos != newpos) {
            console.log("p" + this.previousNavScrollPos + " n" +  newpos    );
            this.previousNavScrollPos = newpos;
          }
          else {
            console.log("unsubs");
            this.sub.unsubscribe();
            this.previousNavScrollPos = -1;
            
          }
          console.log("ti");
        });
      }
      */
   /*   let wait: number = 250;
      setTimeout(() => {
        window.scroll({behavior: 'smooth', top: scrollToFragmentPosition});
      }, wait);

*/


 //   }
    



    //this.scrolling(this.scrollToFragmentPosition);




  }

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



}


