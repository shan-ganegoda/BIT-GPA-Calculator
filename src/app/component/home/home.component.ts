import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {FinalmessageComponent} from "../../util/dialog/finalmessage/finalmessage.component";
import {DatatransferService} from "../../Services/datatransfer.service";

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

  selected = 'notselected';

  datas:any;
  year2values:any;
  year3values:any;


  datum:any;

  grades: string[] = ['A+', 'A', "A-",'B+', 'B', "B-",'C+', 'C', "C-",'D+', 'D', "E"];
  ens: string[] = ['Pass', 'Fail'];

  logo: string = 'assets/logo.jpg';

  yearone !: FormGroup;
  yeartwo !: FormGroup;
  yearthree !: FormGroup;

  first !:any;
  second !:any;
  third !:any;

  breakpoint : number = 3;

  constructor(private fb:FormBuilder,
              private dg:MatDialog,
              private dt:DatatransferService
              ){

    this.yearone = this.fb.group({
       "ip" : new FormControl("null"),
       "is" : new FormControl("null"),
       "im" : new FormControl("null"),
       "cs" : new FormControl("null"),
       "pc" : new FormControl("null"),

       "ds" : new FormControl("null"),
       "web1" : new FormControl("null"),
       "csk1" : new FormControl("null"),
       "se" : new FormControl("null"),
       "mc" : new FormControl("null")
     });

    this.yeartwo = this.fb.group({
      "dsa" : new FormControl("null"),
      "web2" : new FormControl("null"),
      "csk2" : new FormControl("null"),
      "dms" : new FormControl("null"),
      "ooad" : new FormControl("null"),

      "asd" : new FormControl("null"),
      "ead" : new FormControl("null"),
      "cn" : new FormControl("null"),
      "uxd" : new FormControl("null"),
      "pm" : new FormControl("null")
    });

    this.yearthree = this.fb.group({
      "fme" : new FormControl("null"),
      "pp" : new FormControl("null"),
      "pis" : new FormControl("null"),
      "sana" : new FormControl("null"),
      "mc2" : new FormControl("null"),

      "etit" : new FormControl("null"),
      "sdp" : new FormControl("null"),
      "mad" : new FormControl("null"),
      "nsa" : new FormControl("null"),
      "bt" : new FormControl("null"),
      "qa" : new FormControl("null")
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
      case "null" : return 0.00; break;
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

  calculatey1gpa(condition:boolean){

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

    console.log(this.ip,this.is,this.cs,this.pc,this.web1, this.se,this.ds,this.mc)



//Calcutate GPA
    var yr1gpa=(this.is*4 + this.ip*4 + this.cs*4 + this.pc*3 + this.ds*4 + this.web1*4 + this.mc*3 + this.se*4)/30
    var year1gpa = Math.round(yr1gpa * 100) / 100;

    //Condition 1 : GPA Level Should Be Greater Than 2
    var c1 = true;
    var haveminimumgpa = "";
    if(year1gpa >= 2.00){
      haveminimumgpa = "Yes";
      c1 = true;
    }else{
      haveminimumgpa = "No";
      c1 = false;
    }

    //console.log("Minimum GPA level-" +haveminimumgpa + "(" + year1gpa + ")");

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

    //console.log("Credit Count - " + creditcount);

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
    let conditionstatement = "";

    //console.log(this.is);

    if(this.is == 0 || this.mc == 0 || this.cs == 0 || this.ip == 0 ||
      this.pc == 0 || this.web1 == 0 || this.ds == 0 || this.se == 0){

      conditionstatement = "Yes";
    }else{
      conditionstatement = "No";
    }

    // console.log("Below D - " + c4);


    var proceedtonextyear = "";
    var clr = "";
    if(c1 && c2 && c3 && conditionstatement === "No"){
      proceedtonextyear = "Congratulations! You Can Proceed To Next Year";
      clr = "RED";
    }else{
      proceedtonextyear = "Sorry You Can't Proceed To Next Year";
      clr = "GREEN";
    }

    this.datas = {"y1gpa": year1gpa,"y1credit" :creditcount,"is": this.is , "ip": this.ip,"pc": this.pc,"cs": this.cs,"se":this.se,"ds": this.ds,"mc":this.mc,"web1": this.web1};


    this.datum = {"heading": "Year 1 GPA Status","gpa":year1gpa,"condition1":haveminimumgpa,"condition2":minimumcreditcount,"condition3":allenspassed,"condition4":conditionstatement,"prmsg":proceedtonextyear};

    if(condition){
      this.MessageDialog();
    }

  }

  MessageDialog(){
    const stsmsg = this.dg.open(MessageComponent, {
      width: '500px',
      data: {message: this.datum}
    });
  }

  sendY1Data(){
    this.calculatey1gpa(false);
    this.dt.setY1Data(this.datas);
  }

  calculatey2gpa(condition:boolean){

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
    let c1 = true;
    var haveminimumgpa = "";
    if(year2gpa >= 2.00){
      c1 = true;
      haveminimumgpa = "Yes";
    }else{
      c1=false;
      haveminimumgpa = "No";
    }

    //Condition 2: Minimum of 20 Credits Of C Grade of GPA Courses

    var creditcount = 0;
    var minimumcreditcount = "";

    if(this.dsa>=2){
      creditcount += 3;
    }
    if(this.dms>=2){
      creditcount += 3;
    }
    if(this.web2>=2){
      creditcount += 4;
    }
    if(this.ooad>=2){
      creditcount += 3;
    }

    if(this.asd>=2){
      creditcount += 4;
    }
    if(this.ead>=2){
      creditcount += 4;
    }
    if(this.cn>=2){
      creditcount += 3;
    }
    if(this.pm>=2){
      creditcount += 3;
    }
    if(this.uxd>=2){
      creditcount += 3;
    }

    let c2 = true;
    if(creditcount >= 20){
      minimumcreditcount = "Yes";
      c2 = true;
    }else{
      minimumcreditcount = "No";
      c2=false;
    }

    //Condition 3 - All En Subjects Should be passed

    var allenspassed = "";
    let c3 = true;

    if(this.second.csk2 === 'Pass'){
      allenspassed = "Yes";
      c3 = true;
    }else{
      allenspassed = "NO";
      c3 = false;
    }

    //Condition 4 - No Grades Below D

    var conditionstatement = "";

    if(this.dsa == 0 || this.dms == 0 || this.ooad == 0 || this.web2 == 0 || this.asd == 0 ||
      this.cn == 0 || this.ead == 0 || this.pm == 0 || this.uxd == 0){

      conditionstatement = "Yes";
    }else{
      conditionstatement = "No";
    }

    var proceedtonextyear = "";
    var clr = "";
    if(c1 && c2 && c3 && conditionstatement === "No"){
      proceedtonextyear = "Congradulations! You Can Proceed To Next Year";
    }else{
      proceedtonextyear = "Sorry You Can't Proceed To Next Year";
    }

    let year = 1;

    this.datum = {"heading": "Year 2 GPA Status","gpa":year2gpa,"condition1":haveminimumgpa,
      "condition2":minimumcreditcount,"condition3":allenspassed,"condition4":conditionstatement,"prmsg":proceedtonextyear,"yearc":year};

    if(condition){
      this.MessageDialog();
    }


    this.year2values = {"y2gpa": year2gpa,"y2credit" :creditcount,"dsa": this.dsa , "dms": this.dms,"ooad": this.ooad,"web2": this.web2,"ead":this.ead,"cn": this.cn,"asd":this.asd,"pm": this.pm,"uxd": this.uxd};

  }

  sendY2Data(){
    this.sendY1Data();
    this.calculatey2gpa(false);
    this.dt.setY2Data(this.year2values);
  }

  calculatey3gpa(condition:boolean){

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
    var year3gpa = Math.round(yr3gpa * 100) / 100;

    //Condition 1 : GPA Level Should Be Greater Than 1.5
    let c1 = true;
    var haveminimumgpa = "";
    if(year3gpa >= 2.00){
      c1 = true;
      haveminimumgpa = "Yes";
    }else{
      c1=false;
      haveminimumgpa = "No";
    }

    //Condition 2: Minimum of 20 Credits Of C Grade of GPA Courses

    var creditcount = 0;
    var minimumcreditcount = "";

    if(this.pp>=2){
      creditcount += 3;
    }
    if(this.sdp>=2){
      creditcount += 8;
    }
    if(this.pis>=2){
      creditcount += 3;
    }
    if(this.sana>=2){
      creditcount += 3;
    }

    if(this.mad>=2){
      creditcount += 4;
    }
    if(this.nsa>=2){
      creditcount += 3;
    }
    if(this.bt>=2){
      creditcount += 3;
    }
    if(this.qa>=2){
      creditcount += 3;
    }

    let c2 = true;
    if(creditcount >= 20){
      minimumcreditcount = "Yes";
      c2 = true;
    }else{
      minimumcreditcount = "No";
      c2=false;
    }

    //Condition 3 - All En Subjects Should be passed

    var allenspassed = "";
    let c3 = true;

    if(this.third.fme === 'Pass' && this.third.etit === 'Pass'){
      allenspassed = "Yes";
      c3 = true;
    }else{
      allenspassed = "NO";
      c3 = false;
    }

    //Condition 4 - No Grades Below D

    var conditionstatement = "";

    if(this.sdp == 0 || this.pp == 0 || this.pis == 0 || this.sana == 0 || this.mad == 0 ||
      this.nsa == 0 || this.bt == 0 || this.qa == 0){
      conditionstatement = "Yes";
    }else{
      conditionstatement = "No";
    }

    var proceedtonextyear = "";
    var clr = "";
    if(c1 && c2 && c3 && conditionstatement === "No"){
      proceedtonextyear = "Congradulations! You Have Completed The Year 3";
    }else{
      proceedtonextyear = "Sorry You Have To try Again";
    }

    this.datum = {"heading": "Year 3 GPA Status","gpa":year3gpa,"condition1":haveminimumgpa,"condition2":minimumcreditcount,"condition3":allenspassed,"condition4":conditionstatement,"prmsg":proceedtonextyear};

    this.year3values = {"y3gpa": year3gpa,"y3credit" :creditcount,"pp": this.pp , "sdp": this.sdp,"pis": this.pis,"sana": this.sana,"mad":this.mad,"nsa": this.nsa,"bt":this.bt,"qa": this.qa };

    if(condition){
      this.MessageDialog();
    }

    // console.log(year3gpa);

  }

  sendY3Data(){
    this.sendY2Data();
    this.calculatey3gpa(false);
    this.dt.setY3Data(this.year3values);
  }

  overollgpacalculate(){

    this.first = JSON.stringify(this.yearone.getRawValue());
    this.first = JSON.parse(this.first);

    this.second = JSON.stringify(this.yeartwo.getRawValue());
    this.second = JSON.parse(this.second);

    this.third = JSON.stringify(this.yearthree.getRawValue());
    this.third = JSON.parse(this.third);

    this.is = this.getValue(this.first.is);
    this.ip = this.getValue(this.first.ip);
    this.cs = this.getValue(this.first.cs);
    this.pc = this.getValue(this.first.pc);

    this.web1 = this.getValue(this.first.web1);
    this.se = this.getValue(this.first.se);
    this.ds = this.getValue(this.first.ds);
    this.mc = this.getValue(this.first.mc);

    this.dms = this.getValue(this.second.dms);
    this.dsa = this.getValue(this.second.dsa);
    this.ooad = this.getValue(this.second.ooad);
    this.web2 = this.getValue(this.second.web2);

    this.uxd = this.getValue(this.second.uxd);
    this.ead = this.getValue(this.second.ead);
    this.asd = this.getValue(this.second.asd);
    this.cn = this.getValue(this.second.cn);
    this.pm = this.getValue(this.second.pm);

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

    let allsub = (this.ooad*3 + this.dsa*3 + this.dms*3 + this.web2*4 + this.uxd*3 + this.ead*4 + this.pm*3 + this.asd*4 + this.cn*3 + this.ooad*3 + this.dsa*3 + this.dms*3 + this.web2*4 + this.uxd*3 + this.ead*4 + this.pm*3 + this.asd*4 + this.cn*3 +
                          this.sdp*8 + this.pp*3 + this.pis*3 + this.sana*3 + this.qa*3 + this.mad*4 + this.nsa*3 + this.bt*3)/90;

    let overallgpa = Math.round(allsub*100)/100;

    //Condition1 - Cumulative Gpa should be over 2.00
    let c1 = true;
    let condition1 = "yes";
    if(overallgpa >= 2.00){
      c1=true;
      condition1 = "yes";
    }else{
      c1=false;
      condition1 = "No";
    }

    //Condition 2- minimum 90 credits


    let creditcount = 0;
    let minimumcreditcount = "";

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

    if(this.dsa>=2){
      creditcount += 3;
    }
    if(this.dms>=2){
      creditcount += 3;
    }
    if(this.web2>=2){
      creditcount += 4;
    }
    if(this.ooad>=2){
      creditcount += 3;
    }

    if(this.asd>=2){
      creditcount += 4;
    }
    if(this.ead>=2){
      creditcount += 4;
    }
    if(this.cn>=2){
      creditcount += 3;
    }
    if(this.pm>=2){
      creditcount += 3;
    }
    if(this.uxd>=2){
      creditcount += 3;
    }

    if(this.pp>=2){
      creditcount += 3;
    }
    if(this.sdp>=2){
      creditcount += 8;
    }
    if(this.pis>=2){
      creditcount += 3;
    }
    if(this.sana>=2){
      creditcount += 3;
    }

    if(this.mad>=2){
      creditcount += 4;
    }
    if(this.nsa>=2){
      creditcount += 3;
    }
    if(this.bt>=2){
      creditcount += 3;
    }
    if(this.qa>=2){
      creditcount += 3;
    }

    //console.log("Credit Count :- "+creditcount);
    let c2 = true;
    if(creditcount == 90){
      minimumcreditcount = "Yes";
      c2 = true;
    }else{
      minimumcreditcount = "No";
      c2=false;
    }


    //Condition 3 - All En Subjects Should be passed

    var allenspassed = "";
    let c3 = true;

    if(this.third.fme === 'Pass' && this.third.etit === 'Pass' && this.second.csk2 === 'Pass' && this.first.im === 'Pass' && this.first.csk1 === 'Pass'){
      allenspassed = "Yes";
      c3 = true;
    }else{
      allenspassed = "No";
      c3 = false;
    }

    let condition4 = "Yes";
    if(creditcount != 90){
      condition4 = "Yes";
    }else{
      condition4 = "No";
    }

    let prmsg = ""
    if(c1 && c2 && c3){
      prmsg = "Congradulation You Are Graduated!"
    }else{
      prmsg = "Better Luck Next Time!"
    }


    const datum = {"gpa":overallgpa,"condition1":condition1,
      "condition2":minimumcreditcount,"condition3":allenspassed,"condition4":condition4,"prmsg":prmsg };

    const stsmsg = this.dg.open(FinalmessageComponent, {
      width: '500px',
      data: {heading: "Degree Status", message: datum}
    });



    //console.log(c2 + " - " + creditcount);
    //console.log(overallgpa);
  }

}
