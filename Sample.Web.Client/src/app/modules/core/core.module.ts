import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [
    NavbarComponent,
    HeaderComponent 
  ]
})
export class CoreModule { }
