import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { Companies } from 'src/app/model/companies';
import { CurrentAccountService } from 'src/app/services/current_account.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent {
  constructor(
    private router:Router,
    private comService:CompanyService,
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

  public companyArray: Companies[] = [];
  public deletedCoid:number = -1;

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async viewLocation(coidParam:number){
    await this.delay(5);
    if(this.deletedCoid!=coidParam){
      this.comService.getCompanies(coidParam).subscribe(res => {
        if(res.pop()!=undefined){
          this.router.navigate(['/companies/viewcompany'],{queryParams:{coid:coidParam}});
        }
      });
    }else{
      this.deletedCoid=-1;
    }
  }

  ngOnInit() {
      this.comService.getCompanies(-1).subscribe(res => {
        this.companyArray = res;
      });
  }
  editLocation(coidparam:number){
    this.router.navigate(['/companies/edit'],{queryParams:{coid:coidparam}});
  }

  deleteCompany(coid:number, coname:string){
    this.deletedCoid = coid;
    if(confirm("Are you sure you want to delete the product :\n\n" +coid+' : '+coname)){
      if(this.comService.deleteCompany(coid,coname)){
        location.reload()
      }else{
        alert("ERROR!!!\n Could Not Delete Company");
      }
    }
  }
}
