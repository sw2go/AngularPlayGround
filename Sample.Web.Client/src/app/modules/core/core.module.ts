import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    RouterModule    // "routerLink" is used by NavbarComponent
  ],
  declarations: [
    HeaderComponent,
    NavbarComponent
    
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule { }
