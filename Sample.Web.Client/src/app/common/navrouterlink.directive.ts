import { Directive, Attribute, ElementRef, OnDestroy, Input, Optional, HostBinding} from '@angular/core';
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

    @HostBinding('class.active') 
    public showAsActive: boolean;

    getUrl() {
        if (this.fragment == null)
            return this.routerLink;
        else 
            return this.routerLink + "#" + this.fragment;
    }

    getFragment() {
        return this.fragment;
    }

    getRouterLink() {
        return this.routerLink;
    }

}