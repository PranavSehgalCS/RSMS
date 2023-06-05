import { Account } from '../model/account';
import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";

import { removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})

export class CurrentAccountService {
  private currAccount: Account;

  
  constructor(private title: Title) { 
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
    var properties = {expires: 0.2, path:'/'};
    setCookie('id', String(acc.id), properties);
    setCookie('username', acc.username, properties);
    setCookie('password', acc.password, properties);
    setCookie('admin', acc.admin, properties);
    setCookie('isAccCookies', 'true', properties);
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

  setTitle(title:string){
    this.title.setTitle(title);
  }

  logout() {
    const newuser = <Account>({
      id:0,
      username:"",
      password: " ",
      admin: false,
      })
    removeCookie('id');
    removeCookie('admin');
    removeCookie('username');
    removeCookie('password');
    removeCookie('isAccCookies');
    setCookie('nav_id',6);
    this.currAccount = newuser;
  }

  loggedin():boolean{
    if(this.getAccount().username == "" || this.getAccount().id == 0){
      return false;
    }
    return true;
  }
}