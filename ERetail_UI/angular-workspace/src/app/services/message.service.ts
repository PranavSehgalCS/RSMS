import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class MessageService {
  messages: string[] = [];
  errorMsg: string = '';
  failure: string = "form__message--error";
  success: string = "form__message form__message--success";
  allClass: string = this.success;
  add(message: string) {
    this.messages.push(message);
    
  }

  changeError(msg: string, colour: number = 0) {
    this.errorMsg = msg;
    if(colour == 0){
      this.allClass = this.success;
    }else{
      this.allClass = this.failure; 
    }
  }

  clear() {
    this.messages = [];
  }
}