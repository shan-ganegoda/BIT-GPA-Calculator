import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  openNav() {
    // @ts-ignore
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    // @ts-ignore
    document.getElementById("mySidenav").style.width = "0";
  }

}
