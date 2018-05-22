import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

export interface INavSection {
  getId(): string; 
  getTop(): number;
  scrollTo();
}

@Injectable()
export class NavService {

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

  private sections: Array<INavSection> = [];

  public add(item: INavSection) {
    if (!this.sections.some(function(i) { return i.getId() == item.getId();})) {
      this.sections.push(item);
      console.log("add " + item.getId());
    }
  }

  public remove(item: INavSection) {
    let found: number = this.sections.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.sections.splice(found,1); 
      console.log("del " + item.getId())
    } 
  }

  public Current(position:number) {
    for (let i=this.sections.length - 1; i >= 0; i-- ) {
      if (position > this.sections[i].getTop() -56)
        return this.sections[i];
    }    
    return null;
  }

  public scrollTo() {

    this.sections.forEach(element => {

      if (this.url.endsWith("#" + element.getId())) {
        console.log("before auto scroll to")
        element.scrollTo();
      }
      else {
        
      }
              

    });


    
    

  }


}


