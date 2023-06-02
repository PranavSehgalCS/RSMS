import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";

import { Account } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import { setCookie } from 'typescript-cookie'
import { MessageService } from 'src/app/services/message.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  public selectedAccount? : Account;
  constructor(
    private router:Router, 
    private titleService:Title,
    public messageService: MessageService,
    private accountService: AccountService, 
    private CAService: CurrentAccountService,
  ){
    let loadAccount = new Account();
    this.titleService.setTitle('Login to RSMS'); 
    this.messageService.changeError("Enter Username and Password to Log-in",0);
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies(); 
      this.CAService.setAccount(loadAccount);
      this.router.navigate(['/dashboard']);
    }
  }
  
  async submitForm(userName: string, password: string) {
    if(userName.length == 0){
      this.messageService.changeError("No username has been entered !!", 0)
    }else if(password.length == 0){
      this.messageService.changeError("Please enter a Password"); 
    }else if(password.length < 4 ){
      this.messageService.changeError("Password must have at least 4 Characters"); 
    }else if(password.length > 32 ){
      this.messageService.changeError("Password Length Can't Exceed 32 Characters"); 
    }else{
      try {
        this.selectedAccount = await this.accountService.getAccount(userName.trim().toLowerCase(), password).toPromise();
        if(this.selectedAccount==null){
          this.messageService.changeError("Incorrect Name or Password, Please try again "); 
        }else{
          if(this.selectedAccount.id == 0){
            this.messageService.changeError("No such user, please create account");
          }else if(this.selectedAccount.id == 1){
            this.messageService.changeError("Incorrect Name or Password,\n Please try again ");
          }else if(this.selectedAccount.id == 2){
            this.messageService.changeError("No Connection to DB, Please try later");
          }else{
            this.CAService.setAccount(this.selectedAccount);
            var exp = 10;
            if(this.selectedAccount.admin){
              exp = 1;
            }
            window.alert("Login Success! \n Welcome "+userName.trim().charAt(0).toUpperCase() +  userName.trim().slice(1).toLowerCase());
            this.router.navigate(['/dashboard']);
          }   
        }
      }catch (error) {
        
      }
    }
  }
}