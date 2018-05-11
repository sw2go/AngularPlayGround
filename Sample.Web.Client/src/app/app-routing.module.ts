import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent} from './app.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DetailpageComponent } from './detailpage/detailpage.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';
//import { NgbdCarouselBasic } from './carousel-basic/carousel-basic.component';

const routes: Routes = [ 
  { path: '', component: MainpageComponent },
  { path: 'details', component: DetailpageComponent },
  { path: 'about', component: AboutpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
