import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { Categories } from 'src/app/model/categories';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';
@Component({
  selector: 'app-viewcategory',
  templateUrl: './viewcategory.component.html',
  styleUrls: ['../../Product_Components/create-product/create-product.component.css']
})
export class ViewcategoryComponent {
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private catService:CategoryService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("View Company Details");
    }else{
      this.router.navigate(['/login']);
    }
  }

  public curCaid:number = 0;
  public curCaname:string = "";
  public curCadesc:string = "";

  ngOnInit() {
    this.curCaid = Number(this.route.snapshot.queryParamMap.get('caid'));
    if(this.curCaid== null){
      alert("ERROR! \nNo Parameter 'caid' detected");
    }
    if(this.curCaid!=undefined && this.curCaid!=null){
      this.catService.getCategories(this.curCaid).subscribe(res => {
        var curVal = res.pop();
          if(curVal!=undefined){
            this.curCaname = curVal.caname;
            this.curCadesc = curVal.cadesc;
          }
      });
    } 
  }

  editLocation(caidParam:number){
    this.router.navigate(['/categories/edit'],{queryParams:{caid:caidParam}});
  }
}
