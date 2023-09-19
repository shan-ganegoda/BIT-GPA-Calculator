import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {scales} from "chart.js";
import {DatatransferService} from "../../Services/datatransfer.service";

@Component({
  selector: 'app-progressionpage',
  templateUrl: './progressionpage.component.html',
  styleUrls: ['./progressionpage.component.css']
})
export class ProgressionpageComponent implements OnInit {

  logo: string = './assets/logo.jpg'
  breakpoint: number = 0;
  breakpoint2: number = 0;
  breakpoint3: number = 0;


  is = 0;  ip = 0;  cs = 0;  pc = 0;
  se = 0;  ds = 0;  web1 = 0;  mc = 0;

  dsa = 0;  dms = 0;  ooad = 0;  web2 = 0;
  ead = 0;  asd = 0;  pm = 0;  uxd = 0;  cn = 0;

  pp =0;  sdp =0;  pis =0;  sana=0;
  mad =0;  nsa =0;  bt =0;  qa=0;

  public yearchart: any;
  public semchart: any;
  public sem1creditchart: any;

  year1sub = ["IS", "IP", "CS", "PC", "SE", "DS", "WEB-1", "MC"];
  year2sub = ["DSA", "DMS", "OOAD", "WEB-2", "EAD", "ASD", "UXD", "PM", "CN"];
  year3sub = ["PP", "SDP", "PIS", "SANA", "MAD", "NSA", "BT or MC2","QA"];


  /*======== Global Values  ==========*/

  year: string = '0';
  semester: string = '0';
  credit: string = '0';
  gpalevel: number = 0;
  postyeartext:string ="";

  /*======== Overall Charts ==========*/

  overallsemdata: number[] = [];
  overallyeardata: string[] = [];

  /*======== Data Collection ==========*/

  year1Data: any;
  year2Data: any;
  year3Data: any;

  //Year 1 Data

  year1gpa: string = "null";
  sem1gpa = 0;
  sem2gpa = 0;
  year1results: number[] = [];

//Year 2 Data
  year2gpa: string = "null";
  sem3gpa = 0;
  sem4gpa = 0
  year2results: number[] = [];


//Year 3 Data
  year3results: number[] = [];
  year3gpa: string = "null";
  sem5gpa = 0;
  sem6gpa = 0


  constructor(private dt: DatatransferService) {
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 4;
    this.breakpoint2 = (window.innerWidth <= 768) ? 6 : 12;
    this.breakpoint3 = (window.innerWidth <= 768) ? 4 : 12;

    this.createYearChart();
    this.createSemChart();
    this.createYear1Chart();
    this.createYear2Chart();
    this.createYear3Chart();


    if (JSON.parse(this.dt.getY1Data()).creditcount > 0) {
      this.year1Data = JSON.parse(this.dt.getY1Data());
      this.setYear1Values();

    } else {
      //console.log("Year 1 Data Cannot Fetched");
    }

    if (JSON.parse(this.dt.getY2Data()).creditcount > 30) {
      this.year2Data = JSON.parse(this.dt.getY2Data());
      this.setYear2Values();

    } else {
      //console.log("Year 2 Data Cannot Fetched");
    }

    if (JSON.parse(this.dt.getY3Data()).creditcount > 60) {
      this.year3Data = JSON.parse(this.dt.getY3Data());
      //console.log(this.year3Data);
      this.setYear3Values();

    } else {
      //console.log("Year 3 Data Cannot Fetched");
    }

    if(JSON.parse(this.dt.getY3Data()).creditcount > 60){
      this.year3Data = JSON.parse(this.dt.getY3Data());
      this.setYear3Values();
    }

    switch (this.year){
      case "1" : this.postyeartext = "st"; break;
      case "2" : this.postyeartext = "nd"; break;
      case "3" : this.postyeartext = "rd"; break;
      default : this.postyeartext = "th"; break;
    }

  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 4;
    this.breakpoint2 = (event.target.innerWidth <= 768) ? 6 : 12;
    this.breakpoint3 = (event.target.innerWidth <= 768) ? 4 : 12;
  }

  setYear1Values() {

    this.year1gpa = this.year1Data.year1gpa;
    this.sem1gpa = this.year1Data.sem1gpa;
    this.sem2gpa = this.year1Data.sem2gpa;

    this.year = this.year1Data.year;
    this.credit = this.year1Data.creditcount;
    this.gpalevel = this.year1Data.currentgpa;
    this.semester = this.year1Data.semester;

    this.is = Number(this.year1Data.is);
    this.ip = Number(this.year1Data.ip);
    this.cs = Number(this.year1Data.cs);
    this.pc = Number(this.year1Data.pc);

    this.se = Number(this.year1Data.se);
    this.ds = Number(this.year1Data.ds);
    this.web1 = Number(this.year1Data.web1);
    this.mc = Number(this.year1Data.mc);

    this.overallsemdata.pop();
    this.overallsemdata.pop();
    this.overallyeardata.pop();

    this.year1results.push(this.is, this.ip, this.cs, this.pc, this.se, this.ds, this.web1, this.mc);
    this.overallsemdata.push(this.sem1gpa, this.sem2gpa);
    this.overallyeardata.push(this.year1gpa);
  }

  setYear2Values() {
    this.overallsemdata.pop();
    this.overallsemdata.pop();
    this.overallyeardata.pop();
    this.setYear1Values();

    this.year2gpa = this.year2Data.year2gpa;
    this.sem3gpa = this.year2Data.sem3gpa;
    this.sem4gpa = this.year2Data.sem4gpa;

    this.year = this.year2Data.year;
    this.credit = this.year2Data.creditcount;
    this.gpalevel = this.year2Data.currentgpa;
    this.semester = this.year2Data.semester;

    this.dsa = Number(this.year2Data.dsa);
    this.dms = Number(this.year2Data.dms);
    this.ooad = Number(this.year2Data.ooad);
    this.web2 = Number(this.year2Data.web2);

    this.ead = Number(this.year2Data.ead);
    this.asd = Number(this.year2Data.asd);
    this.uxd = Number(this.year2Data.uxd);
    this.pm = Number(this.year2Data.pm);
    this.cn = Number(this.year2Data.cn);

    this.year2results.push(this.dsa, this.dms, this.ooad, this.web2, this.ead, this.asd, this.uxd, this.pm, this.cn);

    // this.overallsemdata = [];
    this.overallsemdata.push(this.sem3gpa, this.sem4gpa);

    // this.overallyeardata=[];
    this.overallyeardata.push(this.year2gpa);

    // console.log(this.year1gpa, this.year2gpa);
    // console.log(this.overallyeardata);
  }

  setYear3Values() {
    this.overallsemdata.pop();
    this.overallsemdata.pop();
    this.overallyeardata.pop();
    this.setYear2Values();

    this.year3gpa = this.year3Data.year3gpa;
    this.sem5gpa = this.year3Data.sem5gpa;
    this.sem6gpa = this.year3Data.sem6gpa;

    this.year = this.year3Data.year;
    this.credit = this.year3Data.creditcount;
    this.gpalevel = this.year3Data.currentgpa;
    this.semester = this.year3Data.semester;

    this.pp = Number(this.year3Data.pp);
    this.sdp = Number(this.year3Data.sdp);
    this.pis = Number(this.year3Data.pis);
    this.sana = Number(this.year3Data.sana);

    this.mad = Number(this.year3Data.mad);
    this.nsa = Number(this.year3Data.nsa);
    this.bt = Number(this.year3Data.bt);
    this.qa = Number(this.year3Data.qa);

    this.year3results.push(this.pp, this.sdp, this.pis, this.sana, this.mad, this.nsa, this.bt, this.qa);

    this.overallsemdata.push(this.sem5gpa, this.sem6gpa);

    this.overallyeardata.push(this.year3gpa);

    //console.log(this.year1gpa, this.year2gpa,this.year3gpa);
    //console.log(this.overallyeardata);
    //console.log(this.overallsemdata);
  }

  createYearChart() {

    this.yearchart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: ['Year-1', 'Year-2', 'Year-3'],
        datasets: [
          {
            data: this.overallyeardata,
            backgroundColor: 'lightblue',
            borderColor: 'red',
            tension: 0.5,
            borderWidth: 3,
            fill: true,

          },
        ],

      },

      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Overall Year GPA Progression',
            position: 'top',
            font: {
              weight: 'bold',
              size: 30
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
              color: 'red'
            }
          },
          y: {
            min: 0,
            title: {
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

  createSemChart() {

    this.semchart = new Chart("SemChart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: ['Sem-1', 'Sem-2', 'Sem-3', 'Sem-4', 'Sem-5', 'Sem-6'],
        datasets: [
          {
            data: this.overallsemdata,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ], borderColor: [
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
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Overall Semester GPA Progression',
            position: 'top',
            font: {
              weight: 'bold',
              size: 30
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Semester',
              color: 'red'
            }
          },
          y: {
            title: {
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

  createYear1Chart() {

    this.semchart = new Chart("Year1Chart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: this.year1sub,
        datasets: [
          {
            data: this.year1results,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
            ], borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
            ],
            borderWidth: 1,
            borderRadius: 10,
          },
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Year 1 Subject Evaluate',
            color: 'white',
            position: 'top',
            font: {
              weight: 'bold',
              size: 30
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Subjects',
              color: 'red'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Grade',
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

  createYear2Chart() {

    this.semchart = new Chart("Year2Chart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: this.year2sub,
        datasets: [
          {
            data: this.year2results,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ], borderColor: [
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
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Year 2 Subject Evaluate',
            color: 'white',
            position: 'top',
            font: {
              weight: 'bold',
              size: 30
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Subjects',
              color: 'red'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Grade',
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

  createYear3Chart() {

    this.semchart = new Chart("Year3Chart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: this.year3sub,
        datasets: [
          {
            data: this.year3results,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ], borderColor: [
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
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Year 3 Subject Evaluate',
            color: 'white',
            position: 'top',
            font: {
              weight: 'bold',
              size: 30
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Subjects',
              color: 'red'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Grade',
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



}
