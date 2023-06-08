import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Account } from 'src/app/model/account';
import { Products } from 'src/app/model/products';
import { Companies } from 'src/app/model/companies';
import { Categories } from 'src/app/model/categories';

import { ProductService } from 'src/app/services/product.service';
import { CompanyService } from 'src/app/services/company.service';
import { CategoryService } from 'src/app/services/category.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrls: ['./viewproduct.component.css']
})
export class ViewproductComponent{
  constructor(
    private router:Router,
    private proService:ProductService,
    private comService:CompanyService,
    private catService:CategoryService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("Create Product");
    }else{
      this.router.navigate(['/login']);
    }
  }

  public companyArray: Companies[] = [];
  public categoryArray: Categories[] = [];
  
  ngOnInit() {
    this.comService.getCompanies(-1).subscribe(res => {
      this.companyArray = res;
    });
    this.comService.getCompanies(-1).subscribe(res => {
      this.companyArray = res;
    });
}


}
