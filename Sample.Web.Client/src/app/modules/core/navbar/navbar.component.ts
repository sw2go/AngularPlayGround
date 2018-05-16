import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, RouterEvent } from '@angular/router';
import { log } from 'util';

@Component({
  selector: 'core-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  collapsed: boolean = true;  // used to hide menu 
  scrolled: boolean = false;  // used to make navbar transparent 
  inmain: boolean = true;     // we are on main page 

  constructor(private _router : Router) { 

    _router.events.subscribe( (event: RouterEvent) => {

      if (event instanceof NavigationStart) {
        console.log(event.url);
      }

      if (event instanceof NavigationEnd) {
        this.inmain = (event.url == "/");
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
    });    
  }

  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event']) checkScroll() {
    const scrollPosition = window.pageYOffset;

    this.scrolled = (scrollPosition > 5);  
  }
}

