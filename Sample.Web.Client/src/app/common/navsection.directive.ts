import { Directive, Attribute, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {NavService, INavSection} from '../core/services/navservice.service';

@Directive({
  selector:"[navSection]"
})
export class NavSectionDirective implements OnInit, OnDestroy, INavSection { 
       
    constructor(@Attribute('id') private id:string,  private el: ElementRef, private ns: NavService) {
    }

    ngOnInit () {
        this.ns.add(this);
    }

    ngOnDestroy () {
        this.ns.remove(this);
    }

    getId() {
        return this.id;
    }

    getTop() {          
        return this.el.nativeElement.offsetTop;
    }

}