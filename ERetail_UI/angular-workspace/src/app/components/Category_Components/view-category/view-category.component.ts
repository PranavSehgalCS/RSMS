import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Account } from 'src/app/model/account';
import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/model/categories';
import { CategoryService } from 'src/app/services/category.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';



@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['../../Company_Component/view-company/view-company.component.css']
})
export class ViewCategoryComponent implements OnInit {
  constructor(
    private router:Router,
    private CatService:CategoryService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("View Categories");
    }else{
      this.router.navigate(['/login']);
    }
  }

  public categoryArray: Categories[] = [];

  ngOnInit() {
      this.CatService.getCategories(-1).subscribe(res => {
        this.categoryArray = res;
      });
  }
  editLocation(caidparam:number){
    this.router.navigate(['/categories/edit'],{queryParams:{caid:caidparam}});
  } 
  deleteCat(caid:number, caname:string){
    if(confirm("Are you sure you want to delete the product :\n\n" +caid+' : '+caname)){
      if(this.CatService.deleteCategory(caid,caname)){
        location.reload()
      }else{
        alert("ERROR!!!\n Could Not Delete Category");
      }
    }
  }
}
