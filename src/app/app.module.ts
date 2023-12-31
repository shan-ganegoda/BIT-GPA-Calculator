import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './component/home/home.component';
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import { AboutComponent } from './component/about/about.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { FinalmessageComponent } from './util/dialog/finalmessage/finalmessage.component';
import {MatMenuModule} from "@angular/material/menu";
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { MainwindowComponent } from './component/mainwindow/mainwindow.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ProgressionpageComponent } from './component/progressionpage/progressionpage.component';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatBadgeModule} from "@angular/material/badge";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessageComponent,
    AboutComponent,
    ContactUsComponent,
    FinalmessageComponent,
    LandingPageComponent,
    MainwindowComponent,
    NavbarComponent,
    ProgressionpageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatExpansionModule,
        MatInputModule,
        MatSelectModule,
        MatGridListModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule,
        MatBadgeModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
