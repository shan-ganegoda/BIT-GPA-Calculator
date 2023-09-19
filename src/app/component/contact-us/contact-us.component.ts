import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../../Services/EmailService/email.service";
import {EmailJSResponseStatus} from "emailjs-com";
import {MatSnackBar} from "@angular/material/snack-bar";
// import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  logo: string = 'assets/logo.jpg';

   constructor(private snackBar:MatSnackBar) { }


  feedbackForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required])
  });

  get nameField(): FormControl {
    return this.feedbackForm.controls.name as FormControl;
  }

  get emailField(): FormControl {
    return this.feedbackForm.controls.email as FormControl;
  }

  get messageField(): FormControl {
    return this.feedbackForm.controls.message as FormControl;
  }

  sendFeedBack() {
    if (this.feedbackForm.valid) {
      const emailParams = {
        from_name: this.nameField.value,
        from_email: this.emailField.value,
        message: this.messageField.value
      };

      EmailService.send( emailParams ).then((response: EmailJSResponseStatus) => {

        this.snackBar.open('Email sent','',{
          duration: 3000, // Duration in milliseconds
          direction: 'ltr',
          horizontalPosition: 'right', // Position: 'start', 'center', 'end', 'left', 'right'
          verticalPosition: 'top', // Position: 'top', 'bottom'
          panelClass: 'success-snackbar', // Add custom CSS classes
          // ... other options
        })


        this.clearFeedback();
        // You can display a success message to the user here
      })
        .catch((error: any) => {
          this.snackBar.open('Email Sent Failed','',{
            duration: 3000, // Duration in milliseconds
            direction: 'ltr',
            horizontalPosition: 'right', // Position: 'start', 'center', 'end', 'left', 'right'
            verticalPosition: 'top', // Position: 'top', 'bottom'
            panelClass: 'error-snackbar', // Add custom CSS classes
            // ... other options
          })
          // You can display an error message to the user here
        });
    }
  }

  clearFeedback(){
    this.feedbackForm.reset();
  }
}
