import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { NavbarComponent} from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] //,
  //viewProviders: [ NavbarComponent ]
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChildren(RouterLink) links: QueryList<RouterLink>

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    console.log("xxx " + this.links.length);

    this.links.forEach( rl => { console.log(rl.fragment) });

  }

}
