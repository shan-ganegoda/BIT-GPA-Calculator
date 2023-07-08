import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  grades: string[] = ['A+', 'A', "A-",'B+', 'B', "B-",'C+', 'C', "C-",'D+', 'D', "E"];
  gpas: number[] = [4.00, 4.00, 3.70,3.30, 3.00, 2.70,2.30, 2.00, 1.70,1.30, 1.00, 0.00];
  subjects1 : string[] = ['Information Systems','Computer Systems','Personal Computing with Foss','Introduction to Programming'];

  logo: string = 'assets/logo.jpg';
}
