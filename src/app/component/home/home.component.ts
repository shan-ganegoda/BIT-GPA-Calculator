import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../util/dialog/message/message.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  is !: any; ip !: any; pc !: any; cs !: any;
  mc !: any; ds !: any; se !: any; web1 !: any;

  dsa !: any; dms !: any; web2 !: any; ooad !: any;
  asd !: any; uxd !: any; ead !: any; cn !: any; pm!: any;

  fme !: any; pp !: any; sdp !: any; pis !: any; sana!: any;
  etit !: any; mad !: any; nsa !: any; bt !: any; qa!:any;


  grades: string[] = ['A+', 'A', "A-",'B+', 'B', "B-",'C+', 'C', "C-",'D+', 'D', "E"];
  ens: string[] = ['Pass', 'Fail'];
  gpas: number[] = [4.00, 4.00, 3.70,3.30, 3.00, 2.70,2.30, 2.00, 1.70,1.30, 1.00, 0.00];
  subjects1 : string[] = ['Information Systems','Computer Systems','Personal Computing with Foss','Introduction to Programming'];

  logo: string = 'assets/logo.jpg';

  yearone !: FormGroup;
  yeartwo !: FormGroup;
  yearthree !: FormGroup;

  first !:any;
  second !:any;
  third !:any;

  breakpoint : number = 3;

  constructor(private fb:FormBuilder,
              private dg:MatDialog
              ){
     this.yearone = this.fb.group({
       "ip" : new FormControl(),
       "is" : new FormControl(),
       "im" : new FormControl(),
       "cs" : new FormControl(),
       "pc" : new FormControl(),

       "ds" : new FormControl(),
       "web1" : new FormControl(),
       "csk1" : new FormControl(),
       "se" : new FormControl(),
       "mc" : new FormControl()
     });

    this.yeartwo = this.fb.group({
      "dsa" : new FormControl(),
      "web2" : new FormControl(),
      "csk2" : new FormControl(),
      "dms" : new FormControl(),
      "ooad" : new FormControl(),

      "asd" : new FormControl(),
      "ead" : new FormControl(),
      "cn" : new FormControl(),
      "uxd" : new FormControl(),
      "pm" : new FormControl()
    });

    this.yearthree = this.fb.group({
      "fme" : new FormControl(),
      "pp" : new FormControl(),
      "sdp" : new FormControl(),
      "pis" : new FormControl(),
      "sana" : new FormControl(),
      "mc2" : new FormControl(),

      "etit" : new FormControl(),
      "mad" : new FormControl(),
      "nsa" : new FormControl(),
      "bt" : new FormControl(),
      "qa" : new FormControl()
    });
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
  }

  onResize(event:any) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 3;
  }

  // @ts-ignore
  getValue(value:string){
    //first : this.yearone.getRawValue();

    switch (value){
      case null : return 0; break;
      case 'A+' : return 4.00; break;
      case 'A' : return 4.00; break;
      case 'A-' : return 3.70; break;
      case 'B+' : return 3.30; break;
      case 'B' : return 3.00; break;
      case 'B-' : return 2.70; break;
      case 'C+' : return 2.30; break;
      case 'C' : return 2.00; break;
      case 'C-' : return 1.70; break;
      case 'D+' : return 1.30; break;
      case 'D' : return 1.00; break;
      case 'E' : return 0.00; break;

    }
  }

  calculatey1gpa(){

    this.first = JSON.stringify(this.yearone.getRawValue());
    this.first = JSON.parse(this.first);

    // console.log(this.first)
    // console.log(this.first.is);

    this.is = this.getValue(this.first.is);
    this.ip = this.getValue(this.first.ip);
    this.cs = this.getValue(this.first.cs);
    this.pc = this.getValue(this.first.pc);

    this.web1 = this.getValue(this.first.web1);
    this.se = this.getValue(this.first.se);
    this.ds = this.getValue(this.first.ds);
    this.mc = this.getValue(this.first.mc);



//Calcutate GPA
    var yr1gpa=(this.is*4 + this.ip*4 + this.cs*4 + this.pc*3 + this.ds*4 + this.web1*4 + this.mc*3 + this.se*4)/30
    var year1gpa = Math.round(yr1gpa * 100) / 100;

    //Condition 1 : GPA Level Should Be Greater Than 1.5
    var c1 = true;
    var haveminimumgpa = "";
    if(year1gpa >= 1.50){
      haveminimumgpa = "Yes";
      c1 = true;
    }else{
      haveminimumgpa = "No";
      c1 = false;
    }

    console.log("Minimum GPA level-" +haveminimumgpa + "(" + year1gpa + ")");

    //Condition 2: Minimum of 20 Credits Of C Grade of GPA Courses

    var creditcount = 0;
    var minimumcreditcount = "";

    if(this.is>=2){
      creditcount += 4;
    }
    if(this.pc>=2){
      creditcount += 3;
    }
    if(this.cs>=2){
      creditcount += 4;
    }
    if(this.ip>=2){
      creditcount += 4;
    }

    if(this.mc>=2){
      creditcount += 3;
    }
    if(this.se>=2){
      creditcount += 4;
    }
    if(this.web1>=2){
      creditcount += 4;
    }
    if(this.ds>=2){
      creditcount += 4;
    }


   var c2 = true;
    if(creditcount >= 20){
      minimumcreditcount = "Yes";
      c2=true;
    }else{
      minimumcreditcount = "No";
      c2=false;
    }

    console.log("Credit Count - " + creditcount);

    //Condition 3 - All En Subjects Should be passed

    var allenspassed = "";

    var c3 = true;
    if(this.first.im === 'Pass' && this.first.csk1 === 'Pass' ){
      allenspassed = "Yes";
      c3 = true;
    }else{
      allenspassed = "NO";
      c3 = false;
    }

    //Condition 4 - No Grades Below D
    var c4 = true;

    var conditionstatement = "";

    if(this.first.is == 0 && this.first.mc == 0 && this.first.cs == 0 && this.first.ip == 0 && this.first.pc == 0 && this.first.web1 == 0 && this.first.ds == 0 && this.first.se == 0){
      c4 = false;
    }else{
      c4 = true;
    }

    if(!c4){
      conditionstatement = "Yes";
    }else{
      conditionstatement = "No";
    }

    var proceedtonextyear = "";
    var clr = "";
    if(c1 && c2 && c3 && c4){
      proceedtonextyear = "Congratulations! You Can Proceed To Next Year";
      clr = "RED";
    }else{
      proceedtonextyear = "Sorry You Can't Proceed To Next Year";
      clr = "GREEN";
    }

    const msg = "Your Year 1 GPA : " + year1gpa +
            "<br> " +
            "<br>Progression Conditions" +
            "<br> " +
            "<br>A Minimum GPA of 1.50 : " + haveminimumgpa +
            "<br>A minimum of 20 credits of C grade for GPA courses: " + minimumcreditcount  +
            "<br>A “PASS” grade for all EN courses : " + allenspassed +
            "<br>Has not obtained a grade below D grade: " + conditionstatement +
            "<br> " +
            "<br>Year Progression : " + proceedtonextyear;


    const datum = {"gpa":year1gpa,"condition1":haveminimumgpa,"condition2":minimumcreditcount,"condition3":allenspassed,"condition4":conditionstatement,"prmsg":proceedtonextyear};




    const stsmsg = this.dg.open(MessageComponent, {
      width: '500px',
      data: {heading: "Year 1 GPA Status", message: datum}
    });

    //console.log(yr1gpaRound);

  }

  calculatey2gpa(){

    this.second = JSON.stringify(this.yeartwo.getRawValue());
    this.second = JSON.parse(this.second);

    this.dms = this.getValue(this.second.dms);
    this.dsa = this.getValue(this.second.dsa);
    this.ooad = this.getValue(this.second.ooad);
    this.web2 = this.getValue(this.second.web2);

    this.uxd = this.getValue(this.second.uxd);
    this.ead = this.getValue(this.second.ead);
    this.asd = this.getValue(this.second.asd);
    this.cn = this.getValue(this.second.cn);
    this.pm = this.getValue(this.second.pm);



    var yr2gpa=(this.ooad*3 + this.dsa*3 + this.dms*3 + this.web2*4 + this.uxd*3 + this.ead*4 + this.pm*3 + this.asd*4 + this.cn*3)/30
    var year2gpa = Math.round(yr2gpa * 100) / 100;

    //Condition 1 : GPA Level Should Be Greater Than 1.5
    var haveminimumgpa = "";
    if(year2gpa >= 1.50){
      haveminimumgpa = "Yes";
    }else{
      haveminimumgpa = "No";
    }

    //Condition 2: Minimum of 20 Credits Of C Grade of GPA Courses

    var creditcount = 0;
    var minimumcreditcount = "";

    if(this.dsa>2){
      creditcount += 3;
    }
    if(this.dms>2){
      creditcount += 3;
    }
    if(this.web2>2){
      creditcount += 4;
    }
    if(this.ooad>2){
      creditcount += 3;
    }

    if(this.asd>2){
      creditcount += 3;
    }
    if(this.ead>2){
      creditcount += 4;
    }
    if(this.cn>2){
      creditcount += 3;
    }
    if(this.pm>2){
      creditcount += 3;
    }
    if(this.uxd>2){
      creditcount += 3;
    }


    if(creditcount >= 20){
      minimumcreditcount = "Yes";
    }else{
      minimumcreditcount = "No";
    }

    //Condition 3 - All En Subjects Should be passed

    var allenspassed = "";

    if(this.second.csk2 === 'Pass'){
      allenspassed = "Yes";
    }else{
      allenspassed = "NO";
    }

    //Condition 4 - No Grades Below D
    var condition4 = true;

    var conditionstatement = "";

    if(this.second.dsa == 0){
      condition4 = false;
    }

    if(this.second.dms == 0){
      condition4 = false;
    }

    if(this.second.ooad == 0){
      condition4 = false;
    }

    if(this.second.web2 == 0){
      condition4 = false;
    }

    if(this.second.asd == 0){
      condition4 = false;
    }

    if(this.second.cn == 0){
      condition4 = false;
    }

    if(this.second.ead == 0){
      condition4 = false;
    }

    if(this.second.pm == 0){
      condition4 = false;
    }

    if(this.second.uxd == 0){
      condition4 = false;
    }

    if(!condition4){
      conditionstatement = "Yes";
    }else{
      conditionstatement = "No";
    }

    var proceedtonextyear = "";
    var clr = "";
    if(haveminimumgpa !== "Yes" || minimumcreditcount !== "Yes" || allenspassed !== "Yes"  || conditionstatement !== "Yes"){
      proceedtonextyear = "Sorry You Can't Proceed To Next Year";
      clr = "RED";
    }else{
      proceedtonextyear = "Congradulations! You Can Proceed To Next Year";
      clr = "GREEN";
    }

    const msg = "Your Year 2 GPA : " + year2gpa +
      "<br> " +
      "<br>Progression Conditions" +
      "<br> " +
      "<br>A Minimum GPA of 1.50 : " + haveminimumgpa +
      "<br>A minimum of 20 credits of C grade for GPA courses: " + minimumcreditcount  +
      "<br>A “PASS” grade for all EN courses : " + allenspassed +
      "<br>Has not obtained a grade below D grade: " + conditionstatement +
      "<br> " +
      "<br>Year Progression : " + proceedtonextyear;




    const stsmsg = this.dg.open(MessageComponent, {
      width: '500px',
      data: {heading: "Year 2 GPA Status", message: msg}
    });

    //console.log(yr1gpaRound);

    console.log(year2gpa);

  }

  calculatey3gpa(){

    this.third = JSON.stringify(this.yearthree.getRawValue());
    this.third = JSON.parse(this.third);

    this.fme = this.getValue(this.third.fme);
    this.pp = this.getValue(this.third.pp);
    this.sdp = this.getValue(this.third.sdp);
    this.pis = this.getValue(this.third.pis);
    this.sana = this.getValue(this.third.sana);

    this.etit = this.getValue(this.third.etit);
    this.mad = this.getValue(this.third.mad);
    this.nsa = this.getValue(this.third.nsa);
    this.bt = this.getValue(this.third.bt);
    this.qa = this.getValue(this.third.qa);



    var yr3gpa=(this.sdp*8 + this.pp*3 + this.pis*3 + this.sana*3 + this.qa*3 + this.mad*4 + this.nsa*3 + this.bt*3)/30
    var yr3gpaRound = Math.round(yr3gpa * 100) / 100;

    console.log(yr3gpaRound);

  }

}
