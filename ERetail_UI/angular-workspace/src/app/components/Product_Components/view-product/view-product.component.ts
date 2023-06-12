import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { Products } from 'src/app/model/products';
import { ProductService } from 'src/app/services/product.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})

export class ViewProductComponent {
  constructor(
    private router:Router,
    private proService:ProductService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("View Products");
    }else{
      this.router.navigate(['/login']);
    }
  }
  private deletedCode:string= "";
  public productArray: Products[] = [];
  public headNum:number = this.productArray.length;
  ngOnInit() {
    this.proService.getProducts("null").subscribe(res => {
      this.productArray = res;
      this.headNum = this.productArray.length; 
    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async viewLocation(pcodeParam:string){
    await this.delay(5);
    if(this.deletedCode!=pcodeParam){
      this.proService.getProducts(pcodeParam).subscribe(res => {
        if(res.pop()!=undefined){
          this.router.navigate(['/products/viewproduct'],{queryParams:{pcode:pcodeParam}});
        }
      });
    }else{
      this.deletedCode="";
    }
  }
  editLocation(pcodeParam:string){
    this.router.navigate(['/products/edit'],{queryParams:{pcode:pcodeParam}});
  }
  
  deleteProduct(pcode:string, pname:string){
    this.deletedCode = pcode;
    if(confirm("Are you sure you want to delete the product :\n\n" +pcode+' : '+pname)){
      if(this.proService.deleteProduct(pcode,pname)){
        var remElem = document.getElementById(pcode);
        if(remElem!=null){
          if(remElem.parentNode!=null){
            remElem.parentNode.removeChild(remElem);
            this.headNum-=1;
          }
        }
      }else{
        alert("ERROR!!!\n Could Not Delete Company");
      }
    }
  }

}
