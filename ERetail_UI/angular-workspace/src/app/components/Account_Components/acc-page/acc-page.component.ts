import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";

import { Account } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import { setCookie } from 'typescript-cookie'
import { MessageService } from 'src/app/services/message.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';


@Component({
  selector: 'app-acc-page',
  templateUrl: './acc-page.component.html',
  styleUrls: ['../login/login.component.css']
})
export class AccPageComponent {
  constructor(
    private router:Router,
    private titleService:Title,
    private AService:AccountService,
    private CAService: CurrentAccountService,
    public messageService:MessageService
  ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      this.messageService.changeError("");
      loadAccount.getAccountCookies(); 
      this.CAService.setAccount(loadAccount);
      this.titler();
    }else{
      this.router.navigate(['/login']);  
    }
  }

  titler():void{
    var r:string = this.CAService.getUsername();
    r = r.charAt(0).toUpperCase() +  r.slice(1) + "'s  Page";
    this.titleService.setTitle(r);
  }
  accountID():number{
    return this.CAService.getID();
  }

  accountName():string{
    return this.CAService.getUsername();
  }

  accountPassword():string{
    return this.CAService.getPassword();
  }

  async submitUpdateForm(passWord:string, passwordAgain:string){
    if(passWord.length == 0){
      this.messageService.changeError("Please enter a Password");
    }else if(passWord!=passwordAgain){
      this.messageService.changeError("The Passwords dont match!");
    }else if(passWord.length > 32){
      this.messageService.changeError("Password Lenght Can't Exceed 32 Chars!");
    }else if( this.AService.hashPass(passWord) == this.CAService.getPassword()){
      this.messageService.changeError("New Password Same As Old Password");
    }else{
      const updatedUser = new Account({
        'id':this.CAService.getID() ,
        'username':this.CAService.getUsername(),
        'password':this.AService.hashPass(passWord),
        'admin':this.CAService.getAdmin()
      });
      try{
        var acctResponse = await this.AService.updateAccount(updatedUser).toPromise();
        if(acctResponse == null){
          this.messageService.changeError("Error occurred while updating password.");
        }else if(acctResponse.id == 2){
          this.messageService.changeError("No DB Connection! Please try again later");
        }else{
          this.messageService.changeError("");
          this.CAService.setAccount(updatedUser);
          alert("Password successfully changed to : '" + passWord + "'");
        }
      }catch(error){
        console.log(error);
        this.messageService.changeError("Error occurred while adding account.");
      }
    }
  }

  async submitDelForm(){
    var c1 = confirm("Are You Sure You Want To DELETE Your Account?\nThis Is A Non-Reversible Action!");
    if(!(this.CAService.getAdmin() && c1)){
      var c2 = true;
    }else{
      var c2 = confirm("Are You Sure? \nYou Will LOSE your ADMIN Status!");  
    }

    if(c1 && c2){
      var responseVal = String(window.prompt("Please Enter Your Username To Continue", "Enter Username")).toLowerCase();
      if(this.CAService.getUsername().toLowerCase() == responseVal){
        var updateResponse = await this.AService.deleteAccount(this.CAService.getAccount());
        this.messageService.changeError("DELETE check" + updateResponse);
        alert("Account has been DELETED\n Logging You Out....");
        this.CAService.logout();
        this.router.navigate(['/login']);
      }else{
        this.messageService.changeError("Incorrect Username, Account Deletion Cancelled");
      }
    }
  }
}
