import { Component, OnInit, HostListener, ViewChildren, QueryList, AfterViewInit, ContentChildren } from '@angular/core';
import { Router, NavigationEnd,  RouterEvent, RouterLink } from '@angular/router';
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

  constructor(private router : Router, private navservice: NavService) { 

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

    let x: INavRouterLink = this.navservice.Current(scrollPosition);
    if (x != null)
      console.log("curpos " + x.getUrl());
  }

}

