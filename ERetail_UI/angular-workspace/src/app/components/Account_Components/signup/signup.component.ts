import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";

import { Account } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.css']
})

export class SignupComponent {
  constructor(
    private router:Router, 
    private titleService:Title,
    private accountService:AccountService,
    public messageService: MessageService
  ){
    this.titleService.setTitle("Sign up");
    this.messageService.changeError("Create a new account!" ,0);
  }

  
  async submitThisForm(userName:string, passWord:string, passwordAgain:string){
    userName = userName.toLowerCase();
    if(userName.length == 0) {
      this.messageService.changeError("Please enter a Username");
    }else if(passWord.length == 0){
      this.messageService.changeError("Please enter a Password");
    }else if(passWord!=passwordAgain){
      this.messageService.changeError("The Passwords dont match!");
    }else if(passWord.length > 32){
      this.messageService.changeError("Password Lenght Can't Exceed 32 Chars!");
    }else{
      const newUser = new Account({
        'id':0 ,
        'username':userName,
        'password':passWord,
        'admin':false
      });
      try{
        var acctResponse = await this.accountService.addAccount(newUser).toPromise();
        if(acctResponse == null){
          this.messageService.changeError("Error occurred while adding account.");
        }else if(acctResponse.id == 2){
          this.messageService.changeError("No DB Connection! Please try again later");
        }else if(acctResponse.id == 3){
          this.messageService.changeError("Username Taken!");
        }else if(acctResponse.id >5){
          alert("Account Created Successfully!\n Please continue to login!");
          this.router.navigate(['/login']);
        }else{
          this.messageService.changeError("Click Again To Confirm Creation...");}
      }catch(error){
        console.log(error);
        this.messageService.changeError("Error occurred while adding account.");
      }
    }
  }
}