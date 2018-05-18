import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { NavService } from './services/navservice.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [NavService],
    exports: []
})
export class CoreModule { }
