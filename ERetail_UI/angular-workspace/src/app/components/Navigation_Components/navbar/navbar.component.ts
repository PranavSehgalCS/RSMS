import { Component } from '@angular/core';
import { setCookie,getCookie } from 'typescript-cookie';
import { CurrentAccountService } from 'src/app/services/current_account.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  public id: number = Number(getCookie('nav_id'));
  constructor(private CAService: CurrentAccountService) {};

  public addClass(id:any) {
    this.id = id;
    setCookie('nav_id',id);
  }

  logout(){
    this.addClass(6);
    this.CAService.logout();
  }
  
  isAdmin(){
    return this.CAService.getAdmin();
  }

  getAccountId() {
    return this.CAService.getID
  }

  isLoggedIn() {
    this.id = Number(getCookie('nav_id'));
    return !(this.CAService.getAccount().username == "" || this.CAService.getAccount().id == 0);
  }
}