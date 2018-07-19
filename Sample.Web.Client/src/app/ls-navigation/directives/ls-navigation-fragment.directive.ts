import { Directive, Attribute, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { FragmentInterface } from '../internal/fragment.interface';
import { LsNavigationService } from '../services/ls-navigation-service.service';

@Directive({
  selector:"[ls-navigation-fragment]"
})
export class LsNavigationFragmentDirective implements OnDestroy, FragmentInterface, AfterViewInit { 
       
    constructor(@Attribute('id') private id:string,  private el: ElementRef, private ns: LsNavigationService) {
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