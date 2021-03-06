import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { LsNavigationModule } from './ls-navigation/ls-navigation.module';



import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { HeaderComponent } from './common/header/header.component';
import { NavbarComponent } from './common/navbar/navbar.component';
//import {NavbarComponent} from './modules/core/navbar/navbar.component';
import { MainpageComponent } from './common/mainpage/mainpage.component';
import { DetailpageComponent } from './common/detailpage/detailpage.component';
import { AboutpageComponent } from './common/aboutpage/aboutpage.component';

//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from "ngx-bootstrap";
import { CarouselComponent } from './common/carousel-basic/carousel-basic.component';
import { LandingsectionComponent } from './common/mainpage/landingsection/landingsection.component';
import { ServicesectionComponent } from './common/mainpage/servicesection/servicesection.component';

@NgModule({
  imports: [    // list of modules required by this module or it's components
    BrowserModule,
    AppRoutingModule,     // my own routing module app-routing.module.ts
    CarouselModule.forRoot(),
    HttpClientModule,      // HttpClient is used in carousel-basic.component.ts
    CoreModule,
    LsNavigationModule.forRoot( { headerOffset: -56, useFragments: true, updateRouterOnManualScroll: false, activeLinkDisplayPartialMatch: false })
  ],
  declarations: [         // List of module components
    AppComponent,         // <app-root> is used in index.html  
    CarouselComponent,    // <ngbd-carousel-basic> is used in app.component.html
    HeaderComponent, 
    NavbarComponent,
    MainpageComponent,
    DetailpageComponent,
    AboutpageComponent,
    LandingsectionComponent,
    ServicesectionComponent
    ],
  providers: [],
  bootstrap: [AppComponent] // the root component
})

export class AppModule { }
