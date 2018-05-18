import { Component, OnInit } from '@angular/core';
import { NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  viewProviders: [ NavbarComponent ]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
