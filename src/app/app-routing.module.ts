import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./component/home/home.component";
import {AboutComponent} from "./component/about/about.component";
import {ContactUsComponent} from "./component/contact-us/contact-us.component";
import {LandingPageComponent} from "./component/landing-page/landing-page.component";

const routes: Routes = [
  // { path: "", redirectTo: '/gpacalculator', pathMatch: 'full' },
  { path:"" , component: LandingPageComponent },
  { path:"gpacalculator" , component: HomeComponent },
  { path:"contactus" , component: ContactUsComponent },
  { path:"about" , component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
