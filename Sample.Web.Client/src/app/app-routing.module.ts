import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent} from './app.component';
import { NgbdCarouselBasic } from './carousel-basic/carousel-basic.component';

const routes: Routes = [ 
{ path: '', component: NgbdCarouselBasic }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
