import { Injectable } from '@angular/core';

export interface INavSection {
  getId(): string; 
  getTop(): Number;
  getHeight(): Number;
}

@Injectable()
export class NavService {

  constructor() { }

  sections: Array<INavSection> = [];

  public add(item: INavSection) {
    if (!this.sections.some(i => i.getId() == item.getId()))
      this.sections.push(item);
  }

  public remove(item: INavSection) {
    let found: number = this.sections.findIndex(i => i.getId() == item.getId());
    if (found>=0)
      this.sections.splice(found,1);    
  }

}


