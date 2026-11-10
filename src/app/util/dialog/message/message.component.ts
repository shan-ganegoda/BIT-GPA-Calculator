import {DecimalPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule],
  selector: 'app-dialog',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  lines?: [];

  constructor(public dialogRef: MatDialogRef<MessageComponent>, @Inject(MAT_DIALOG_DATA) public data: {message:any}) {

    // this.lines = this.data.message.split('<br>').filter((line: string) => line !== '');
    // console.log(this.data.message.gpa);
  }

  ngOnInit(): void { this.dialogRef.addPanelClass('custom-dialog'); }

  onNoClick(): void { this.dialogRef.close();}

}
