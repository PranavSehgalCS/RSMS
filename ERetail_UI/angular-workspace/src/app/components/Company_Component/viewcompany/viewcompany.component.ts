import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { Companies } from 'src/app/model/companies';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-viewcompany',
  templateUrl: './viewcompany.component.html',
  styleUrls: ['../../Product_Components/create-product/create-product.component.css']
})
export class ViewcompanyComponent {
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private comService:CompanyService,
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

  public curCoid:number = 0;
  public curConame:string = "";
  public curCodesc:string = "";

  ngOnInit() {
    this.curCoid = Number(this.route.snapshot.queryParamMap.get('coid'));
    if(this.curCoid== null){
      alert("ERROR! \nNo Parameter 'coid' detected");
    }
    if(this.curCoid!=undefined && this.curCoid!=null){
      this.comService.getCompanies(this.curCoid).subscribe(res => {
        var curVal = res.pop();
          if(curVal!=undefined){
            this.curConame = curVal.coname;
            this.curCodesc = curVal.codesc;
          }
      });
    } 
  }

  editLocation(coidparam:number){
    this.router.navigate(['/companies/edit'],{queryParams:{coid:coidparam}});
  }
}
