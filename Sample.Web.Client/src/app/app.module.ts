import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';



//import { CoreModule } from './core/core.module';

import {HeaderComponent} from './modules/core/header/header.component';
import {NavbarComponent} from './modules/core/navbar/navbar.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DetailpageComponent } from './detailpage/detailpage.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';

//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from "ngx-bootstrap";
import { NgbdCarouselBasic } from './carousel-basic/carousel-basic.component';



@NgModule({
  imports: [    // list of modules required by this module or it's components
    BrowserModule,
    AppRoutingModule,     // my own routing module app-routing.module.ts
    CarouselModule.forRoot(),
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
