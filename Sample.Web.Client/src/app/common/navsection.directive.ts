import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {NavService, INavSection} from '../core/services/nav.service';

@Directive({
  selector:"[navSection]"
})
export class NavSectionDirective implements OnInit, OnDestroy, INavSection { 

    eRef: ElementRef;
    constructor(private el: ElementRef) {
        this.eRef = el;
    }

    ngOnInit () {

    }

    ngOnDestroy () {

    }

    getId()
    {
        return "";
    }

    getHeight()
    {
        return 0;        
    }

    getTop()
    {
        return 0;
    }

}