import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService, INavSection } from '../../../core/services/nav.service';

@Component({
  selector: 'app-landingsection',
  templateUrl: './landingsection.component.html',
  styleUrls: ['./landingsection.component.scss'],
  providers: [NavService]
})
export class LandingsectionComponent implements OnInit, OnDestroy, INavSection {

  navservice: NavService;
  constructor(private ns: NavService) { 
    this.navservice = ns;

  }

  ngOnInit() {
    this.navservice.add(this);
  }

  ngOnDestroy() {
    this.navservice.remove(this);
  }

  public getId() {
    return "a";
  }
  public getHeight() {
    return 0;    
  }

  getTop() {
    return 0;
  }

}
