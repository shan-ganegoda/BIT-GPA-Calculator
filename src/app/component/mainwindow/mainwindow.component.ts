import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import { Component } from '@angular/core';

@Component({
  imports: [NavbarComponent, RouterOutlet],
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrl: './mainwindow.component.css'
})
export class MainwindowComponent {

}
