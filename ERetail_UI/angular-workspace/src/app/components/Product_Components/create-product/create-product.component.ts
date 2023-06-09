import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Account } from 'src/app/model/account';
import { Component, OnInit } from '@angular/core';

import { Companies } from 'src/app/model/companies';
import { Categories } from 'src/app/model/categories';

import { MessageService } from 'src/app/services/message.service';

import { ProductService } from 'src/app/services/product.service';
import { CompanyService } from 'src/app/services/company.service';
import { CategoryService } from 'src/app/services/category.service';

import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  constructor(
    private router:Router,
    private comService:CompanyService,
    private catService:CategoryService,
    private proService: ProductService,
    public messageService:MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("View Products");
      this.messageService.changeError("{}");
    }else{
      this.router.navigate(['/login']);
    }
  }
  public companyArray: Companies[] = [];
  public categoryArray: Categories[] = [];

  ngOnInit(){
    this.catService.getCategories(-1).subscribe(res => {
      this.categoryArray = res;
      if(!(this.categoryArray.length>0)){
        this.messageService.changeError("No Categories Created, Please Create A Category");
      }
    });
    this.comService.getCompanies(-1).subscribe(res => {
      this.companyArray = res;
      if(!(this.companyArray.length>0)){
        this.messageService.changeError("No Companies Created, Please Create A Company");
      }
    });
  }


  toNum(i:string):number{
    var retString:string[] = i.split(".");
    if(retString.length>0){
      var retVal = Number(retString[0]);
      if(retString.length>1){
        var retVal = (retVal+(Number(retString[1])/Math.pow(10,Number(retString[1].length))));
      }
      this.CAService.setTitle(retVal.toString());
      return retVal;
    }else{
      return 0;
    }
  }
  isValidDate(d:string):Boolean {
    var splitVal:string[] = d.split("-");
    if(splitVal.length<3){
      return false;
    }else if(Number(splitVal[0])<1 || Number(splitVal[1])<1 || Number(splitVal[2])<1){
      return false;
    }
    return true;
  }

  async createProduct(pname:string, category:string, company:string, stock:number, 
    price:string, mnfdate:string, expdate:string, description:string){
    pname = pname.trim().replaceAll("'","");;
    description = description.trim().replaceAll("'",'');;

    if(pname.length==0){
      this.messageService.changeError("Please Enter A Product Name");
    }else if(pname.length>32){
      this.messageService.changeError("Product Name Can't Exceed 32 Characters");
    }else if(category=='?'){
      this.messageService.changeError("Please Select A Category");
      if(!(this.categoryArray.length>0)){
        this.messageService.changeError("No Categories Created, Please Create A Category");
      }
    }else if(company=='?'){
      this.messageService.changeError("Please Select A Company");
      if(!(this.companyArray.length>0)){
        this.messageService.changeError("No Companies Created, Please Create A Company");
      }  
    }else if(isNaN(this.toNum(price)) || this.toNum(price)== 0){
      this.messageService.changeError("Please Enter A Valid Price");
    }else if(isNaN(stock)){
      this.messageService.changeError("Please Enter A Valid Stock");
    }else if(!this.isValidDate(mnfdate)){
      this.messageService.changeError("Please Enter A Valid Manufacturing Date");
    }else if(!this.isValidDate(expdate)){
      this.messageService.changeError("Please Enter A Valid Expiry Date");
    }else if(description.length==0){
      this.messageService.changeError("Please Enter A Product Description");
    }else{
      try {
        var retVal = await this.proService.createProduct(pname, category, company, stock, this.toNum(price), mnfdate, expdate, description);
        if(retVal==true){
          alert("Product '" +pname+"' Created Successfully!");
        }
      }catch (error) {
        alert("An ERROR Occure, Please Try Later");
      }
    }
  }

}
