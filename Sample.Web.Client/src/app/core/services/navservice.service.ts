import { Injectable } from '@angular/core';

export interface INavSection {
  getId(): string; 
  getTop(): number;
}

@Injectable()
export class NavService {

  constructor() { }

  private sections: Array<INavSection> = [];

  public add(item: INavSection) {
    if (!this.   sections.some(function(i) { return i.getId() == item.getId();})) {
      this.sections.push(item);
    }
  }

  public remove(item: INavSection) {
    let found: number = this.sections.findIndex(i => i.getId() == item.getId());
    if (found>=0) {
      this.sections.splice(found,1); 
    } 
  }

  public Current(position:number) {
    for (let i=this.sections.length - 1; i >= 0; i-- ) {
      if (position > this.sections[i].getTop() -56)
        return this.sections[i];
    }    
    return null;
  }

}


