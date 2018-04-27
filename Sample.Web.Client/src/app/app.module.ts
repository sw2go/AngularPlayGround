import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbdCarouselBasic} from './carousel-basic/carousel-basic.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    NgbdCarouselBasic
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
