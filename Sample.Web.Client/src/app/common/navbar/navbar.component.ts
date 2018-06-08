import { Component, OnInit, HostListener, ViewChildren, QueryList, AfterViewInit, ContentChildren } from '@angular/core';
import { Router, NavigationEnd,  RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';

import { log } from 'util';




@Component({
  selector: 'core-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
  
})
export class NavbarComponent implements OnInit, AfterViewInit {



  collapsed: boolean = true;  // used to hide menu 
  scrolled: boolean = false;  // used to make navbar transparent 
  inmain: boolean = true;     // we are on main page 




  constructor(private router : Router) { 

    router.events.subscribe( (event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.inmain = (/[^#?]+/.exec(event.url)[0] == "/");
      }
    });    
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  @HostListener('window:scroll', ['$event']) 
  checkScroll() {    
    this.scrolled = (window.pageYOffset > 5); 
    console.log(window.pageYOffset)   ;
  }




}

