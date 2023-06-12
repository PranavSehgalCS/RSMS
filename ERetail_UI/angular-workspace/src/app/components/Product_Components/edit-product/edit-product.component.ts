import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/model/account';
import { Component, OnInit } from '@angular/core';

import { Products } from 'src/app/model/products';
import { Companies } from 'src/app/model/companies';
import { Categories } from 'src/app/model/categories';

import { MessageService } from 'src/app/services/message.service';

import { ProductService } from 'src/app/services/product.service';
import { CompanyService } from 'src/app/services/company.service';
import { CategoryService } from 'src/app/services/category.service';

import { CurrentAccountService } from 'src/app/services/current_account.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../create-product/create-product.component.css']
})
export class EditProductComponent {
  constructor(
    private router:Router,
    private route:ActivatedRoute,
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
      this.CAService.setTitle("Edit Product");
      this.messageService.changeError("");
    }else{
      this.router.navigate(['/login']);
    }
  }
  
  public curPcode:string = "";
  public curPname:string = "";
  public curCat:string="";
  public curCom:string="";
  public curStock:number=0;
  public curPrice:number=0.0;
  public curDesc:string="";
  public error:boolean = true;
  public Heading:string = "Getting Product Data From Backend ...";
  public dater1:Date = new Date( 2023, 13, 13);
  public dater2:Date = new Date( 2023, 13, 13);
  public companyArray: Companies[] = [];
  public categoryArray: Categories[] = [];

  toNum(i:string){
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

  ngOnInit(){
    this.curPcode = String(this.route.snapshot.queryParamMap.get('pcode'));
    if(this.curPcode=='null'){
      alert("ERROR! \nNo Parameter 'pcode' detected");
      this.Heading="ERROR!! \nInvalid Retrive Link..."
    }
    if(this.curPcode!=undefined && this.curPcode!='null'){
      this.proService.getProducts(this.curPcode).subscribe(res => {
        var curVal=res.pop();
        if(curVal!=null && curVal!=undefined){
            this.curPcode = curVal.pcode;
            this.curPname = curVal.pname;
            this.curCom = curVal.company;
            this.curCat = curVal.category;
            this.curStock = curVal.stock;
            this.curPrice = curVal.price;
            this.curDesc= curVal.description;
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
          this.Heading = ("Editing Product of Code : "+String(this.curPcode));
          this.error=false;
        }else{
          this.error = true;
          this.Heading = ("ERROR!!!");
          this.messageService.changeError(("No Pro With Code : "+String(this.curPcode) + ' Found'))
        }
      });
      this.proService.getProductDates(this.curPcode).subscribe(res => {
        var temp:string[] = res[0].split("-");
        this.dater1 = new Date(Number(temp[0]),Number(temp[1])-1,Number(temp[2]));
        temp = res[1].split("-");
        this.dater2 = new Date(Number(temp[0]),Number(temp[1])-1,Number(temp[2]));
      });
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

  private uname:boolean = false;
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async updateProduct(pname:string, category:string, company:string, stock:number, 
    price:number, mnfdate:string, expdate:string, description:string){
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
    }else if(isNaN(price) || price==0){
      this.messageService.changeError("Please Enter A Valid Price");
    }else if(isNaN(stock) || stock==0){
      this.messageService.changeError("Please Enter A Valid Stock");
    }else if(!this.isValidDate(mnfdate)){
      this.messageService.changeError("Please Enter A Valid Manufacturing Date");
    }else if(!this.isValidDate(expdate)){
      this.messageService.changeError("Please Enter A Valid Expiry Date");
    }else if(expdate<=mnfdate){
      this.messageService.changeError("Expiry Date Must Exceed MNF-Date");
    }else if(description.length==0){
      this.messageService.changeError("Please Enter A Product Description");
    }else{
      try {
        if(this.curPname == pname){
          this.uname = true;
        }else{
          await this.proService.existingProductName(pname).subscribe(res=>{this.uname = !res;});
        }
        await this.delay(50);
        if(this.uname){
          var retVal = await this.proService.updateProduct( this.curPcode,pname, category, company, stock, price, mnfdate, expdate, description);
          if(retVal==true){
            this.curPname=pname;
            this.messageService.changeError("");
            alert("Product '" +pname+"' updated Successfully!");
            
          }else{
            alert("Error While Creating Product")
          }
        }else{
          this.messageService.changeError("That Product Name Already Exists");
        }
      }catch (error) {
        alert("An ERROR Occured, Please Try Later");
      }
    }
  }
}
