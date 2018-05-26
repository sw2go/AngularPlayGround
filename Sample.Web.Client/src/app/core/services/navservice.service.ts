import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, UrlTree } from '@angular/router';

export interface INavRouterLink {
  getUrl(): string;
  getRouterLink(): string; 
  getFragment(): string;
}

export interface INavFragment {
  getId(): string; 
  getOffsetTop(): number;
  scrollToOffsetTop(offset: number);
  routerLink: INavRouterLink;
}

@Injectable()
export class NavService {

  private headerOffset: number = -56;

  private url: string = "";

  constructor(private router: Router) { 

    router.events.subscribe( (event: RouterEvent) => {
  
      if (event instanceof NavigationEnd) {
        console.log("navend " + event.url);  
        this.url = event.url;   
        
        // für cur pos müsste man nur die url ohne fragment herauslösen !!
        // dann sollte das scrolling cur pos auch gehen wenn man via nav auf bla-bal steht und dann zurückscroll zu main 

        
        if (this.pageFragments.length > 0)
          this.scrollTo();


        let xx: UrlTree = this.router.parseUrl(this.router.url);
        
        //let p: string = "";
        //xx.root.children.primary.segments.forEach( x => p = p + "/" + x.path)

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
    for (let i=this.pageFragments.length - 1; i >= 0; i-- ) {
      if (position > this.pageFragments[i].getOffsetTop() + this.headerOffset) {
        // we found a matching fragment - now try to find a matching routerlink 
        let lnk: INavRouterLink = (this.pageFragments[i].getId()==null) 
          ? this.menuLinks.find(x => x.getUrl() == this.url)
          : this.menuLinks.find(x => x.getUrl() == this.url + "#" + this.pageFragments[i].getId()); 

        if (lnk != null)
          return lnk;   // return found link
      }
    }    
    console.log("no frag found");
    return null;
  }


  public scrollTo() {

    // if url contains anchor ( i.e. #) try to fetch the fragment by id
    let foundFragment: INavFragment = this.pageFragments.find(element => this.url.endsWith("#" + element.getId()) );

    // fallback - try to find the fragment with no id ( i.e. page )
    if (!foundFragment)
      foundFragment = this.pageFragments.find(element => element.getId() == null);

    // scroll to the top of the found fragment 
    if (foundFragment)
      foundFragment.scrollToOffsetTop(this.headerOffset);
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


