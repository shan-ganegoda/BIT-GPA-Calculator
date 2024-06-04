import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./component/home/home.component";
import {AboutComponent} from "./component/about/about.component";
import {ContactUsComponent} from "./component/contact-us/contact-us.component";
import {LandingPageComponent} from "./component/landing-page/landing-page.component";
import {ProgressionpageComponent} from "./component/progressionpage/progressionpage.component";
import {MainwindowComponent} from "./component/mainwindow/mainwindow.component";

const routes: Routes = [
  //{ path: "", redirectTo: '/main/gpacalculator', pathMatch: 'full' },
  // { path:"" , component: LandingPageComponent },
  { path:"main" , component: MainwindowComponent, children:[
      { path:"gpacalculator" , component: HomeComponent },
      { path:"contactus" , component: ContactUsComponent },
      { path:"about" , component: AboutComponent },
      { path:"progression" , component: ProgressionpageComponent },
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
