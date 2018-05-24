import { Directive, Attribute, ElementRef, OnDestroy} from '@angular/core';
import {NavService, INavFragment} from '../core/services/navservice.service';

@Directive({
  selector:"[navFragment]"
})
export class NavFragmentDirective implements OnDestroy, INavFragment { 
       
    constructor(@Attribute('id') private id:string,  private el: ElementRef, private ns: NavService) {
        this.ns.addFragment(this);
    }

    ngOnDestroy () {
        this.ns.removeFragment(this);
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