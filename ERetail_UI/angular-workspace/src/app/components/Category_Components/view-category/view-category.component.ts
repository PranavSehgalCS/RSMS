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
    private catService:CategoryService,
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

  public deletedCaid:number = -1;
  public categoryArray: Categories[] = [];

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
 
  public headNum:number = this.categoryArray.length;

  async viewLocation(caidParam:number){
    await this.delay(5);
    if(this.deletedCaid!=caidParam){
      this.catService.getCategories(caidParam).subscribe(res => {
        if(res.pop()!=undefined){
          this.router.navigate(['/categories/viewcategory'],{queryParams:{caid:caidParam}});
        }
      });
    }else{
      this.deletedCaid=-1;
    }
  }
  ngOnInit() {
      this.catService.getCategories(-1).subscribe(res => {
        this.categoryArray = res;
        this.headNum = this.categoryArray.length;
      });
  }
  editLocation(caidparam:number){
    this.router.navigate(['/categories/edit'],{queryParams:{caid:caidparam}});
  } 
  deleteCat(caid:number, caname:string){
    this.deletedCaid = caid;
    if(confirm("Are you sure you want to delete the product :\n\n" +caid+' : '+caname)){
      if(this.catService.deleteCategory(caid,caname)){
        var remElem = document.getElementById(String(caid));
        if(remElem!=null){
          if(remElem.parentNode!=null){
            remElem.parentNode.removeChild(remElem);
            this.headNum-=1;
          }
        }
      }else{
        alert("ERROR!!!\n Could Not Delete Category");
      }
    }
  }
}
