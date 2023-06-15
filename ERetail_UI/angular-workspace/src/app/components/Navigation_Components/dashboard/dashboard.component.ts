import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { setCookie } from 'typescript-cookie';
import {Title} from "@angular/platform-browser";
import { NavbarComponent } from '../navbar/navbar.component';
import { CurrentAccountService } from 'src/app/services/current_account.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  constructor(
    private router: Router,
    private titleService:Title,
    private CAService:CurrentAccountService){
      if(!this.CAService.loggedin()){
        this.router.navigate(['/login']);
      }else if(!this.CAService.getAdmin()){
        this.directButton('accountpage',3);
      }else{
        this.directButton("null",0);
        this.CAService.setTitle("Dashboard");
      }
    }

  async usrName(){
    this.titleService.setTitle(JSON.stringify(this.CAService.getAccount()));
  }

  async logoutButton(){
    this.CAService.logout();
    this.directButton('login',4);
  }
  async directButton(page:String,id:number){
    setCookie('nav_id',id);
    if(page!="null"){
      this.router.navigate(['/'+page]);
    }
  }
}
