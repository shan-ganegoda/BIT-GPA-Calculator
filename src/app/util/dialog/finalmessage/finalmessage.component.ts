import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-finalmessage',
  templateUrl: './finalmessage.component.html',
  styleUrls: ['./finalmessage.component.css']
})
export class FinalmessageComponent {
  lines?: [];

  constructor(public dialogRef: MatDialogRef<FinalmessageComponent>, @Inject(MAT_DIALOG_DATA) public data: {heading:string,message:any}) {

    // this.lines = this.data.message.split('<br>').filter((line: string) => line !== '');
    console.log(this.data.message.gpa);
  }

  ngOnInit(): void { this.dialogRef.addPanelClass('custom-dialog'); }

  onNoClick(): void { this.dialogRef.close();}
}
