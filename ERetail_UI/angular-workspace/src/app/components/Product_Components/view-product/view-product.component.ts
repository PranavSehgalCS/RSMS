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
      this.CAService.setTitle("View Companies");
    }else{
      this.router.navigate(['/login']);
    }
  }
  public productArray: Products[] = [];

  ngOnInit() {
    this.proService.getProducts("null").subscribe(res => {
      this.productArray = res;
    });
  }

  viewLocation(pcodeParam:string){
    this.router.navigate(['/products/viewproduct'],{queryParams:{pcode:pcodeParam}});
  }
  editLocation(pcodeParam:string){
    this.router.navigate(['/products/edit'],{queryParams:{pcode:pcodeParam}});
  }
  
  deleteCompany(pcode:string, pname:string){
    if(confirm("Are you sure you want to delete the product :\n\n" +pcode+' : '+pname)){
      if(this.proService.deleteCompany(pcode,pname)){
        location.reload()
      }else{
        alert("ERROR!!!\n Could Not Delete Company");
      }
    }
  }

}
