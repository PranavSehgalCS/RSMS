import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

import { Account } from 'src/app/model/account';
import { Products } from 'src/app/model/products';

import { ProductService } from 'src/app/services/product.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrls: ['../create-product/create-product.component.css']
})
export class ViewproductComponent{
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private proService:ProductService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("View Product Details");
    }else{
      this.router.navigate(['/login']);
    }
  }
  public curPcode:string ="";
  public curPname:string = "";
  public curCat:string="";
  public curCom:string="";
  public curStock:number=0;
  public curPrice:number=0.0;
  public mnfdat:string="";
  public expdat:string="";
  public curDesc:string="";
  
  ngOnInit() {
    this.curPcode = String(this.route.snapshot.queryParamMap.get('pcode'));
    if(this.curPcode=='null'){
      alert("ERROR! \nNo Parameter 'pcode' detected");
    }
    if(this.curPcode!=undefined && this.curPcode!='null'){
      this.proService.getProducts(this.curPcode).subscribe(res => {
        var curVal = res.pop();
          if(curVal!=undefined){
            this.curPcode = curVal.pcode;
            this.curPname = curVal.pname;
            this.curCom = curVal.company;
            this.curCat = curVal.category;
            this.curStock = curVal.stock;
            this.curPrice = curVal.price;
            this.curDesc= curVal.description;
          }
      });
      this.proService.getProductDates(this.curPcode).subscribe(res => {
        this.mnfdat = res[0]; 
        this.expdat = res[1];
      });
    } 
  }
  editLocation(pcodeParam:string){
    this.router.navigate(['/products/edit'],{queryParams:{pcode:pcodeParam}});
  }


}
