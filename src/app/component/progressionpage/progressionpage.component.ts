import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {scales} from "chart.js";

const SAMPLE_BARCHART_DATA : any[] = [
  { data: [65 ,56,70,30,84,15,20], label: 'Q1 Sales'},
  { data: [10 ,20,30,40,50,60,70], label: 'Q2 Sales'},
];

const SAMPLE_BARCHART_LABELS : string[] = ['W1','W2','W3','W4','W5','W6','W7'];

@Component({
  selector: 'app-progressionpage',
  templateUrl: './progressionpage.component.html',
  styleUrls: ['./progressionpage.component.css']
})
export class ProgressionpageComponent implements OnInit{

  logo : string = './assets/logo.jpg'
  breakpoint : number = 0;
  breakpoint2 : number = 0;
  public yearchart: any;
  public semchart: any;
  public sem1creditchart: any;

  year : string = '3';
  credit : string = '60';
  gpalevel : number = 3.45;

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 4;
    this.breakpoint2 = (window.innerWidth <= 768) ? 2 : 4;
    this.createYearChart();
    this.createSemChart();
    this.createsem1creditchart();
  }

  onResize(event:any) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 4;
    this.breakpoint2 = (event.target.innerWidth <= 768) ? 2 : 4;
  }

  constructor() { }

  // public barChartData : any[] = SAMPLE_BARCHART_DATA;
  // public barChartLabels: string[] = SAMPLE_BARCHART_LABELS;
  // public barChartType : string=  'bar';
  // public barChartLegend = false;
  //
  // public barChartOptions : any = {
  //   scaleShowVerticalLines: false,
  //   responsive:true
  // };

  createYearChart(){

    this.yearchart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: ['Year-1', 'Year-2', 'Year-3'],
        datasets: [
          {
            data: ['2.67','3.76', '3.00'],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            borderWidth: 1,
            borderRadius: 10,
          },
        ]
      },
      options: {
        plugins:{
          legend:{
            display: false
          },
          title:{
            display: true,
            text: 'Overall Year GPA Progression',
            position: 'top',
            font:{
              weight: 'bold',
              size: 30
            }
          }
        },
        scales:{
          x:{
            title:{
              display: true,
              text: 'Year',
              color: 'red'
            }
          },
          y:{
            title:{
              display: true,
              text: 'GPA Level',
              color: 'red'
            }
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 1,
        }

    });
  }

  createSemChart(){

    this.semchart = new Chart("SemChart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: ['Sem-1', 'Sem-2', 'Sem-3','Sem-4', 'Sem-5', 'Sem-6'],
        datasets: [
          {
            data: ['1.5','1.7', '1.6','1.4','1.9', '1.3'],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            borderWidth: 1,
            borderRadius: 10,
          },
        ]
      },
      options: {
        plugins:{
          legend:{
            display: false
          },
          title:{
            display: true,
            text: 'Overall Semester GPA Progression',
            position: 'top',
            font:{
              weight: 'bold',
              size: 30
            }
          }
        },
        scales:{
          x:{
            title:{
              display: true,
              text: 'Year',
              color: 'red'
            }
          },
          y:{
            title:{
              display: true,
              text: 'GPA Level',
              color: 'red'
            }
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 1,
      }

    });
  }
  createsem1creditchart(){

    this.sem1creditchart = new Chart("MyChart1", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Introduction to Programming',
                 'Computer Systems',
                 'Information System',
                 'Personal Computing',
                 'Software Engineering',
                 'Database Systems',
                 'Web Application Development I',
                 'Web Application Development I',
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 240, 100, 432, 253, 34],
          backgroundColor: [
            'red',
            'pink',
            'green',
            'yellow',
            'orange',
            'blue',
          ],
          hoverOffset: 4
        }],
      },
      options: {
        plugins:{
          legend:{
            position : 'right'
          },
          title:{
            display: true,
            text: 'Year 1 Credit Chart',
            position: 'top',
            font:{
              weight: 'bold',
              size: 30
            }
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 1,
      }

    });
  }




}
