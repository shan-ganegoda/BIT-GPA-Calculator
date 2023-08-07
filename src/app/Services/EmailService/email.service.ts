import {Injectable} from '@angular/core';
import {EmailJSResponseStatus} from "emailjs-com";
import * as emailjs from 'emailjs-com';
import {emailjsConfig} from "../../config/emailConfig";
@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor() {
     emailjs.init(emailjsConfig.userId)
  }

  static send(mailParams:any):Promise<EmailJSResponseStatus> {
    return emailjs.send(emailjsConfig.serviceId,emailjsConfig.templateId, mailParams,emailjsConfig.userId);  }
}
