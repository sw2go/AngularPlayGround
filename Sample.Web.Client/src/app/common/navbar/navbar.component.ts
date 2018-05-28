import { Component, OnInit, HostListener, ViewChildren, QueryList, AfterViewInit, ContentChildren } from '@angular/core';
import { Router, NavigationEnd,  RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';

import { Location  } from '@angular/common';
import { log } from 'util';
import { NavService, INavRouterLink} from './../../core/services/navservice.service';



@Component({
  selector: 'core-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
  
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @ViewChildren(RouterLink) anchors: QueryList<any>;

  collapsed: boolean = true;  // used to hide menu 
  scrolled: boolean = false;  // used to make navbar transparent 
  inmain: boolean = true;     // we are on main page 

  previous: INavRouterLink = null; 


  constructor(private router : Router, private location: Location, private navservice: NavService) { 

    router.events.subscribe( (event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.inmain = (event.url == "/");
      }
    });    
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log("hho " + this.anchors.length);
    this.anchors.changes.subscribe((x: QueryList<any>) => { console.log("sali");  });
  }

  @HostListener('window:scroll', ['$event']) 
  checkScroll() {
    const scrollPosition = window.pageYOffset;
    
    this.scrolled = (scrollPosition > 5);

    let current: INavRouterLink = this.navservice.Current(scrollPosition);
    if (current != null) {
      console.log("curpos " + current.getUrl());

      if (this.previous != current) {

        if (this.previous != null) 
          this.previous.textdecoration = "solid";

        this.location.go(current.getUrl());
        current.textdecoration = "underline";
        this.previous = current;
      }
    }
    else {
      console.log("ui no INavRouterLink found" );
    }
  }




}

