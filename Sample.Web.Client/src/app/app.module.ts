import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';

import { NgbdCarouselBasic } from './carousel-basic/carousel-basic.component';

//import { CoreModule } from './core/core.module';

import {HeaderComponent} from './modules/core/header/header.component';
import {NavbarComponent} from './modules/core/navbar/navbar.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DetailpageComponent } from './detailpage/detailpage.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';




@NgModule({
  imports: [    // list of modules required by this module or it's components
    BrowserModule,
    AppRoutingModule,     // my own routing module app-routing.module.ts
    NgbModule.forRoot(),  // ng-bootstrap <ngb-carousel> is used in carousel-basic.component.html
    HttpClientModule      // HttpClient is used in carousel-basic.component.ts
  ],
  declarations: [         // List of module components
    AppComponent,         // <app-root> is used in index.html  
    NgbdCarouselBasic,    // <ngbd-carousel-basic> is used in app.component.html
    HeaderComponent, 
    NavbarComponent,
    MainpageComponent,
    DetailpageComponent,
    AboutpageComponent 
    ],
  providers: [],
  bootstrap: [AppComponent] // the root component
})

export class AppModule { }
