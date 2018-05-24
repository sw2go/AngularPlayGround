import { Directive, Attribute, ElementRef, OnDestroy, Input, Optional} from '@angular/core';
import {NavService, INavRouterLink} from '../core/services/navservice.service';

@Directive({
  selector:"[navRouterLink]"
})
export class NavRouterLinkDirective implements OnDestroy, INavRouterLink { 
       
    constructor(@Attribute('routerLink') private routerLink:string, @Optional() @Attribute('fragment') private fragment:string, private el: ElementRef, private ns: NavService) {
        this.ns.addLink(this);
    }

    ngOnDestroy () {
        this.ns.removeLink(this);
    }

    getFragment() {
        return this.fragment;
    }

    getRouterLink() {
        return this.routerLink;
    }

}