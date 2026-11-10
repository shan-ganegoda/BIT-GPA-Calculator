import {Injectable} from '@angular/core';
import {EmailJSResponseStatus, send} from '@emailjs/browser';
import {emailjsConfig} from "../../config/emailConfig";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  static send(mailParams: Record<string, unknown>): Promise<EmailJSResponseStatus> {
    return send(emailjsConfig.serviceId, emailjsConfig.templateId, mailParams, {publicKey: emailjsConfig.userId});
  }
}
