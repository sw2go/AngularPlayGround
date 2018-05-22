import { Directive, Attribute, ElementRef, OnDestroy} from '@angular/core';
import {NavService, INavSection} from '../core/services/navservice.service';

@Directive({
  selector:"[navSection]"
})
export class NavSectionDirective implements OnDestroy, INavSection { 
       
    constructor(@Attribute('id') private id:string,  private el: ElementRef, private ns: NavService) {
        this.ns.add(this);
    }

    ngOnDestroy () {
        this.ns.remove(this);
    }

    getId() {
        return this.id;
    }

    getOffsetTop() {          
        return this.el.nativeElement.offsetTop;
    }

    scrollToOffsetTop(offset:number = 0): void {

        let wait: number = 250;
        setTimeout(() => {
        window.scroll({behavior: 'smooth', top: this.getOffsetTop() + offset})
        }, wait);
    } 

}