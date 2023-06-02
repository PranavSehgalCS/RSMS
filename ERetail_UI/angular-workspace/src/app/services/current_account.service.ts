import { Account } from '../model/account';
import { Injectable } from '@angular/core';
import { removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})

export class CurrentAccountService {
  private currAccount: Account;

  constructor() { 
    const newuser = <Account>(
      {
      id:0,
      username:"",
      password: " ",
      admin: false,
      })
    this.currAccount = newuser;
  }

  getID() {
    if (this.currAccount?.id != undefined) {
      return this.currAccount?.id
    }
    else {
      return -1
    }
  }

  getAccount() {
    return this.currAccount;
  }

  getUsername(): string {
    if(this.currAccount?.username != undefined) {
      return this.currAccount.username
    } else {
      return "";
    }
  }

  getPassword(): string {
    if(this.currAccount?.password != undefined) {
      return this.currAccount.password
    } else {
      return "";
    }
  }
  getAdmin():boolean {
    return this.currAccount.admin==true ;
  }

  setAccount(acc: Account){
    this.currAccount = acc;
    var exp = 10;
    if(this.currAccount.admin == true){exp = 1;}
    setCookie('id', String(acc.id), {expires:exp});
    setCookie('username', acc.username, {expires:exp});
    setCookie('password', acc.password, {expires:exp});
    setCookie('admin', acc.admin, {expires:exp});
    setCookie('isAccCookies', 'true', {expires:exp});
  }


  setPassword(passWord: string) {
    const newPass = <Account>({
        id: this.currAccount.id,
        username:this.currAccount.username,
        password: passWord,
        admin: this.currAccount.admin
    })
    this.setAccount(newPass);
  }

  logout() {
    const newuser = <Account>({
      id:0,
      username:"",
      password: " ",
      admin: false,
      })
    removeCookie('admin');
    removeCookie('username');
    removeCookie('password');
    setCookie('id', '0');
    setCookie('isAccCookies', 'false');
    this.currAccount = newuser;
  }

  loggedin():boolean{
    if(this.getAccount().username == "" || this.getAccount().id == 0){
      return false;
    }
    return true;
  }
}