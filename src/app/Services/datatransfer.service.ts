import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {

  is !: any;
  ip !: any;
  pc !: any;
  cs !: any;
  mc !: any;
  ds !: any;
  se !: any;
  web1 !: any;

  dsa !: any;
  dms !: any;
  web2 !: any;
  ooad !: any;
  asd !: any;
  uxd !: any;
  ead !: any;
  cn !: any;
  pm!: any;

  fme !: any;
  pp !: any;
  sdp !: any;
  pis !: any;
  sana!: any;
  etit !: any;
  mad !: any;
  nsa !: any;
  bt !: any;
  qa!: any;



  Year1data: any;
  Year2data: any;
  Year3data: any;

  /*============= Overall Data ==============*/

  overallgpa: string = "";
  semester: string = "";
  creditcount: string = "";
  year: string = "";


  /*============= Year 1 Data ==============*/

  year1gpa: string = "";
  sem1gpa: number = 0;
  sem2gpa: number = 0;

  /*============= Year 2 Data ==============*/

  year2gpa: string = "";
  sem3gpa: number = 0;
  sem4gpa: number = 0;

  /*============= Year 2 Data ==============*/

  year3gpa: string = "";
  sem5gpa: number = 0;
  sem6gpa: number = 0;

  y1data: string = "";

  constructor() {
  }

  setY1Data(datas: any) {

    this.year = "1";
    this.creditcount = datas.y1credit;
    this.overallgpa = datas.y1gpa;
    this.year1gpa = datas.y1gpa;

    this.is = datas.is;
    this.ip = datas.ip;
    this.cs = datas.cs;
    this.pc = datas.pc;

    this.se = datas.se;
    this.ds = datas.ds;
    this.mc = datas.mc;
    this.web1 = datas.web1;

    var sem1 = (this.is * 4 + this.ip * 4 + this.cs * 4 + this.pc * 3) / 30;
    this.sem1gpa = Math.round(sem1 * 100) / 100;

    var sem2 = (this.ds * 4 + this.web1 * 4 + this.mc * 3 + this.se * 4) / 30;
    this.sem2gpa = Math.round(sem2 * 100) / 100;

    if (datas.se == 0 && datas.ds == 0 && datas.mc == 0 && datas.web1 == 0) {
      this.semester = "1";
    } else {
      this.semester = "2";
    }


  }

  getY1Data() {
    this.Year1data = {
      "year": this.year,
      "creditcount": this.creditcount,
      "currentgpa": this.overallgpa,
      "semester": this.semester,
      "year1gpa": this.year1gpa,
      "sem1gpa": this.sem1gpa,
      "sem2gpa": this.sem2gpa,
      "is": this.is,
      "ip": this.ip,
      "cs": this.cs,
      "pc": this.pc,
      "se": this.se,
      "ds": this.ds,
      "web1": this.web1,
      "mc": this.mc
    };

    let values = JSON.stringify(this.Year1data);

    return values;
  }

  setY2Data(datas: any) {


    this.year = "2";
    this.creditcount = datas.y2credit + Number(this.creditcount);
    this.year2gpa = datas.y2gpa;
    let gpa = ((datas.y2gpa + Number(this.year1gpa)) / 2);
    this.overallgpa = ((Math.round(gpa*100))/100).toString();


    this.dsa = datas.dsa;
    this.dms = datas.dms;
    this.ooad = datas.ooad;
    this.web2 = datas.web2;

    this.ead = datas.ead;
    this.asd = datas.asd;
    this.pm = datas.pm;
    this.uxd = datas.uxd;
    this.cn = datas.cn;

    var sem3 = (this.dsa * 3 + this.dms * 3 + this.web2 * 4 + this.ooad * 3) / 30;
    this.sem3gpa = Math.round(sem3 * 100) / 100;

    var sem4 = (this.pm * 3 + this.cn * 3 + this.asd * 4 + this.uxd * 3 + this.ead * 4) / 30;
    this.sem4gpa = Math.round(sem4 * 100) / 100;

    if (datas.asd == 0 && datas.ead == 0 && datas.cn == 0 && datas.uxd == 0 && datas.pm == 0) {
      this.semester = "3";
    } else {
      this.semester = "4";
    }

  }

  getY2Data() {
    this.Year2data = {
      "year": this.year,
      "creditcount": this.creditcount,
      "currentgpa": this.overallgpa,
      "semester": this.semester,
      "year2gpa": this.year2gpa,
      "sem3gpa": this.sem3gpa,
      "sem4gpa": this.sem4gpa,
      "dsa": this.dsa,
      "dms": this.dms,
      "ooad": this.ooad,
      "web2": this.web2,
      "ead": this.ead,
      "asd": this.asd,
      "pm": this.pm,
      "uxd": this.uxd,
      "cn": this.cn
    };

    let values = JSON.stringify(this.Year2data);

    return values;
  }

  setY3Data(datas: any) {


    this.year = "3";
    this.creditcount = datas.y3credit + Number(this.creditcount);
    this.year3gpa = datas.y3gpa;
    let gpa = ((Number(this.year1gpa) + Number(this.year2gpa) + datas.y3gpa) / 3);
    this.overallgpa = ((Math.round(gpa*100))/100).toString();

    this.pp = datas.pp;
    this.sdp = datas.sdp;
    this.pis = datas.pis;
    this.sana = datas.sana;

    this.mad = datas.mad;
    this.nsa = datas.nsa;
    this.bt = datas.bt;
    this.qa = datas.qa;


    var sem5 = (this.pp * 3 + this.sdp * 8 + this.pis * 3 + this.sana * 3) / 30;
    this.sem5gpa = Math.round(sem5 * 100) / 100;

    var sem6 = (this.mad * 4 + this.nsa * 3 + this.bt * 3 + this.qa * 3) / 30;
    this.sem6gpa = Math.round(sem6 * 100) / 100;

    if (datas.mad == 0 && datas.nsa == 0 && datas.bt == 0 && datas.qa == 0 && datas.mc2 == 0) {
      this.semester = "5";
    } else {
      this.semester = "6";
    }

  }

  getY3Data() {
    this.Year3data = {
      "year": this.year,
      "creditcount": this.creditcount,
      "currentgpa": this.overallgpa,
      "semester": this.semester,
      "year3gpa": this.year3gpa,
      "sem5gpa": this.sem5gpa,
      "sem6gpa": this.sem6gpa,
      "pp": this.pp,
      "sdp": this.sdp,
      "pis": this.pis,
      "sana": this.sana,
      "mad": this.mad,
      "nsa": this.nsa,
      "bt": this.bt,
      "qa": this.qa
    };

    let values = JSON.stringify(this.Year3data);

    return values;
  }
}










