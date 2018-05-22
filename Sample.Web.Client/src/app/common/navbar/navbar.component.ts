import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd,  RouterEvent } from '@angular/router';
import { log } from 'util';
import { NavService, INavSection} from './../../core/services/navservice.service';


@Component({
  selector: 'core-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

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

  @HostListener('window:scroll', ['$event']) checkScroll() {
    const scrollPosition = window.pageYOffset;

    this.scrolled = (scrollPosition > 5);

    let c: INavSection = this.navservice.Current(scrollPosition);
    if (c != null)
      console.log(c.getId());
  }

}

