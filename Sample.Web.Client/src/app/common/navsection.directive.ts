import { Directive, Attribute, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {NavService, INavSection} from '../core/services/navservice.service';

@Directive({
  selector:"[navSection]"
})
export class NavSectionDirective implements OnInit, OnDestroy, INavSection { 
    
    _id: string;
    _eRef: ElementRef;
    _navSrv: NavService;
    
    constructor(@Attribute('id') private id:string,  private el: ElementRef, private ns: NavService) {
        this._id = id;
        this._eRef = el;
        this._navSrv = ns;
    }

    ngOnInit () {
        this._navSrv.add(this);
        console.log("init");

    }

    ngOnDestroy () {
        this._navSrv.remove(this);
        console.log("destroy");
    }

    getId()
    {
        return this.id;
    }

    getHeight()
    {
        return this.el.nativeElement.offsetHeight;  
    }

    getTop()
    {
        return this.el.nativeElement.offsetTop;
    }

}