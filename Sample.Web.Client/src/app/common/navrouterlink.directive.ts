import { Directive, Attribute, ElementRef, OnDestroy, Input} from '@angular/core';
import {NavService, INavRouterLink} from '../core/services/navservice.service';

@Directive({
  selector:"[navRouterLink]"
})
export class NavRouterLinkDirective implements OnDestroy, INavRouterLink { 
       
    constructor(@Attribute('routerLink') private routerLink:string, private el: ElementRef, private ns: NavService) {
        this.ns.addLink(this);
    }

    @Input('fragment') 
    public fragment: string;

    ngOnDestroy () {
        this.ns.removeLink(this);
    }

    getFragment() {
        return "";// this.fragment;
    }

    getRouterLink() {
        return this.routerLink;
    }

}