import {RouterLink} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Component, OnInit} from '@angular/core';

@Component({
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  logo : string = './assets/logot.png'
  breakpoint : number = 3;

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
  }

  onResize(event:any) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 3;
  }

  navOpen = false;

  openNav() {
    this.navOpen = true;
  }

  closeNav() {
    this.navOpen = false;
  }
}
