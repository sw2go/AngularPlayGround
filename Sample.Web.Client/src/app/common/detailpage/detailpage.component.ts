import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavService } from '../../core/services/navservice.service';

@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.scss']
})
export class DetailpageComponent implements OnInit, AfterViewInit {

  constructor(private ns: NavService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.ns.scrollTo();

  }

}
