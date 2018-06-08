import { Directive, Attribute, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {NavService, INavFragment} from '../core/services/navservice.service';

@Directive({
  selector:"[navFragment]"
})
export class NavFragmentDirective implements OnDestroy, INavFragment, AfterViewInit { 
       
    constructor(@Attribute('id') private id:string,  private el: ElementRef, private ns: NavService) {
        this.ns.addFragment(this);
    }

    ngAfterViewInit() {
        console.log("afterviewinit " + this.id);
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
}