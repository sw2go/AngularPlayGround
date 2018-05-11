import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NavbarComponent,
    HeaderComponent 
  ]
})
export class CoreModule { }
