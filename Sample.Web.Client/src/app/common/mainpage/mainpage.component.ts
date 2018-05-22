import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavService } from '../../core/services/navservice.service';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit, AfterViewInit {

  constructor(private ns: NavService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    console.log("end view init")

    this.ns.scrollTo();

  }

}
