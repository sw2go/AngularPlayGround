import { Directive, Attribute, ElementRef, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, Inject} from '@angular/core';
import { SectionInterface } from '../models/section.interface';
import { LsNavigationService } from '../services/ls-navigation-service.service';


@Directive({
  selector:"[ls-navigation-section]"
})
export class LsNavigationSectionDirective implements OnDestroy, SectionInterface, OnInit, OnChanges { 

    @Input('id') private id:string // instead of @Attribute('id') to allow databinding as well

    private regEx: RegExp;
       
    constructor(private el: ElementRef, private ns: LsNavigationService) {        
    }

    ngOnInit() {
        this.ns.addSection(this);
    }
    
    ngOnDestroy () {
        this.ns.removeSection(this);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.ns.Config.useFragments && changes['id'])
            this.regEx = new RegExp(changes['id'].currentValue);
    }
    
    match(url: string) {
        let result = false; 
        if (this.ns.Config.useFragments) {            
            if (this.id == null) {  // no id defined on the section, this  means 
                result = (url.indexOf("#") < 0);    // there is no # in url required  
                console.log( "match:" +  result  + " frg:" ); // i.e. "/" or "/details"
            }
            else {
                result = url.endsWith("#" + this.id);
                console.log( "match:" +  result  + " frg:" + "#" + this.id );      
            }
        }
        else if(this.regEx) {   
            result = this.regEx.test(url);
            console.log( "match:" +  result  + " rgx:" + this.regEx );            
        }
        else { 
            result = (url === "/");      // case ls-navigation-section without id    
            console.log( "match:" +  result  + " top:" + "/" );
        }
        return result;
    }

    getId() {
        return this.id;
    }

    getOffsetTop() {          

        //*** did not work correct on nested directives
        //return this.el.nativeElement.offsetTop;
        
        //*** did not work correct on IE and Edge
        // return this.el.nativeElement.getBoundingClientRect().top + document.documentElement.scrollTop

        let pos: number = this.pageOffsetY(this.el.nativeElement);
        return pos;
    }

    private pageOffsetY(elem) {
        return elem.offsetParent ? elem.offsetTop + this.pageOffsetY(elem.offsetParent) : elem.offsetTop;
    }

}