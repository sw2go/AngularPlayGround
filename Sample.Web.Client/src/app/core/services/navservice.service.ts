import { Injectable } from '@angular/core';

export interface INavSection {
  getId(): string; 
  getTop(): number;
  getHeight(): number;
}

@Injectable()
export class NavService {

  constructor() { }

  sections: Array<INavSection> = [];

  public add(item: INavSection) {
    if (!this.sections.some(function(i) { return i.getId() == item.getId();})) {
      this.sections.push(item);
      console.log("add " + item.getId() + " " + item.getTop())
    }
    console.log("count " + this.sections.length  );
  }

  public remove(item: INavSection) {
    let found: number = this.sections.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.sections.splice(found,1); 
      console.log("del " + item.getId())
    } 
    console.log("count " + this.sections.length  );
  }

}


