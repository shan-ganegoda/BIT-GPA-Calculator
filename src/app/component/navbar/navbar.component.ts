import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  logo : string = './assets/logo.jpg'
  breakpoint : number = 3;

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
  }

  onResize(event:any) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 3;
  }

  openNav() {
    // @ts-ignore
    document.getElementById("mySidenav").style.width = "250px";
  }
  closeNav() {
    // @ts-ignore
    document.getElementById("mySidenav").style.width = "0";
  }
}
