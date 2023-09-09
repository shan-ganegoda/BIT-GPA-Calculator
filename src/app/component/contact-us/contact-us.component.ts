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
      console.log(emailParams)
      EmailService.send( emailParams ).then((response: EmailJSResponseStatus) => {

        this.snackBar.open('Email sent:','OK',{
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'center', // Position: 'start', 'center', 'end', 'left', 'right'
          verticalPosition: 'top', // Position: 'top', 'bottom'
          panelClass: 'custom-snackbar', // Add custom CSS classes
          // ... other options
        })

        console.log('Email sent:', response);
        // this.toastr.success('Hello world!', 'Toastr fun!');
        this.clearFeedback();
        // You can display a success message to the user here
      })
        .catch((error: any) => {
          console.error('Error sending email:', error);
          // You can display an error message to the user here
        });
    }
  }

  clearFeedback(){
    this.feedbackForm.reset();
  }
}
