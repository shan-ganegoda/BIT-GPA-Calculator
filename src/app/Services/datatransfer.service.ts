import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {

  is !: any; ip !: any; pc !: any; cs !: any;
  mc !: any; ds !: any; se !: any; web1 !: any;

  dsa !: any; dms !: any; web2 !: any; ooad !: any;
  asd !: any; uxd !: any; ead !: any; cn !: any; pm!: any;

  fme !: any; pp !: any; sdp !: any; pis !: any; sana!: any;
  etit !: any; mad !: any; nsa !: any; bt !: any; qa!:any;

  y1data:string="";

  year:string =""
  creditcount:string="";
  overallgpa:string ="";
  sem1gpa:number =0;
  sem2gpa:number =0;

  constructor() { }

  setY1Data(datas:any){
    this.y1data = datas;

    this.year = "1";
    this.creditcount = datas.y1credit;
    this.overallgpa = datas.y1gpa;

    this.is = datas.is;
    this.ip = datas.ip;
    this.cs = datas.cs;
    this.pc = datas.pc;

    this.se = datas.se;
    this.ds = datas.ds;
    this.mc = datas.mc;
    this.web1 = datas.web1;

    var sem1=(this.is*4 + this.ip*4 + this.cs*4 + this.pc*3 )/30;
    this.sem1gpa = Math.round(sem1 * 100) / 100;

    var sem2=(this.ds*4 + this.web1*4 + this.mc*3 + this.se*4 )/30;
    this.sem2gpa = Math.round(sem2 * 100) / 100;

    // console.log(datas);


  }
}
