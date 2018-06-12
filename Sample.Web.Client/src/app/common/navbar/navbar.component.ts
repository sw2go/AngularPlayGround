import { Component, OnInit, HostListener, ViewChildren, QueryList, AfterViewInit, ContentChildren, OnDestroy } from '@angular/core';
import { Router, NavigationEnd,  RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';

import { log } from 'util';
import { NavService } from '../../core/services/navservice.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'core-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
  
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {



  collapsed: boolean = true;  // used to hide menu 
  scrolled: boolean = false;  // used to make navbar transparent 
  inmain: boolean = true;     // we are on main page 


  private sub: Subscription;

  constructor(private router: Router, private ns: NavService ) { 

    router.events.subscribe( (event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.inmain = (/[^#?]+/.exec(event.url)[0] == "/");
      }
    });    
  }

  ngOnInit() {
    //this.sub = this.ns.$gaggi.subscribe( x => { console.log( "geile" + x.getUrl() )})
  }
  
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }



  ngAfterViewInit() {
  }

  @HostListener('window:scroll', ['$event']) 
  checkScroll() {    
    this.scrolled = (window.pageYOffset > 5); 
  }




}

