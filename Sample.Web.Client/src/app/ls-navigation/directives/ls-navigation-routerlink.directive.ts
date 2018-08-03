import { Directive, Attribute, ElementRef, OnDestroy, Input, Optional, HostBinding} from '@angular/core';
import { LinkInterface } from '../models/link.interface';
import { LsNavigationService } from '../services/ls-navigation-service.service';

@Directive({
  selector:"[ls-navigation-routerlink]"
})
export class LsNavigationRouterLinkDirective implements OnDestroy, LinkInterface { 
       
    constructor(@Attribute('routerLink') private routerLink:string, @Optional() @Attribute('fragment') private fragment:string, private el: ElementRef, private ns: LsNavigationService) {
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

    getPath() {
        return this.routerLink;
    }

    getFragment() {
        return this.fragment;
    }



}