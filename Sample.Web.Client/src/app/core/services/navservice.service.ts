import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

export interface INavRouterLink {
  getRouterLink(): string; 
  getFragment(): string;
}

export interface INavSection {
  getId(): string; 
  getOffsetTop(): number;
  scrollToOffsetTop(offset: number);
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
        
        if (this.sections.length > 0)
          this.scrollTo();

      }

    });
  }

  private links: Array<INavRouterLink> = [];

  private sections: Array<INavSection> = [];

  /** to add directive reference to service ( before any navigation happens )  
   * call add in constructor of the directive 
   **/
  public add(item: INavSection) {
    if (!this.sections.some(function(i) { return i.getId() == item.getId();})) {
      this.sections.push(item);
      console.log("add sec " + item.getId());
    }
  }

  /** to remove directive reference from service 
   * call remove in ngOnDestroy 
   **/
  public remove(item: INavSection) {
    let found: number = this.sections.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.sections.splice(found,1); 
      console.log("del sec " + item.getId())
    } 
  }

  public Current(position:number) {
    for (let i=this.sections.length - 1; i >= 0; i-- ) {
      if (position > this.sections[i].getOffsetTop() + this.headerOffset)
        return this.sections[i];
    }    
    return null;
  }


  public scrollTo() {

    // if url contains anchor ( i.e. #) try to fetch the section by id
    let found: INavSection = this.sections.find(element => this.url.endsWith("#" + element.getId()) );

    // fallback - try to find the section with no id ( i.e. page )
    if (!found)
      found = this.sections.find(element => element.getId() == null);

    // scroll to the top of the found section 
    if (found)
      found.scrollToOffsetTop(this.headerOffset);
  }

  public addLink(item: INavRouterLink) {
    if (!this.links.some(function(i) {return i.getRouterLink() == item.getRouterLink() && i.getFragment() == item.getFragment();})) {
      this.links.push(item);
      if (item.getFragment() == null)
        console.log("add link " + item.getRouterLink() );
      else
        console.log("add link " + item.getRouterLink() + "#" + item.getFragment() );
    }
  }

  public removeLink(item: INavRouterLink) {
    let found: number = this.links.findIndex(i => i.getRouterLink() == item.getRouterLink() && i.getFragment() == item.getFragment());
    if (found>=0) {
      this.links.splice(found,1); 
      if (item.getFragment() == null)
        console.log("del link " + item.getRouterLink() );
      else
        console.log("del link " + item.getRouterLink() + "#" + item.getFragment() );

    } 
  }



}


