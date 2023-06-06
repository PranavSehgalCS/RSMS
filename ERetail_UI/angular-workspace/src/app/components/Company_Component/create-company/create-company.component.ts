import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { Companies } from 'src/app/model/companies';
import { MessageService } from 'src/app/services/message.service';
import { CompanyService } from 'src/app/services/company.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['../../Category_Components/create-category/create-category.component.css']
})
export class CreateCompanyComponent {
  constructor(
    private router:Router,
    private ComService:CompanyService,
    public messageService: MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("Create Company");
      this.messageService.changeError("Enter Company Name & Desription To Continue");
    }else{
      this.router.navigate(['/login']);
    }
  }

  async createCompany(coname:string, codesc:string){
    coname = coname.trim().replaceAll("'","");;
    codesc = codesc.trim().replaceAll("'","");;
    if(coname.length==0){
      this.messageService.changeError("Please Enter A Company Name");
    }else if(codesc.length==0){
      this.messageService.changeError("Please Enter A Company Description");
    }else if(coname.length>48){
      this.messageService.changeError("Company Name Can't Be Longer Than 48 Chars");
    }else if(codesc.length>256){
      this.messageService.changeError("Company Description Can't Be Longer Than 256 Chars");
    }else{
      try{
        var retVal = await this.ComService.createCompany(coname, codesc).subscribe();
        if(retVal!=null){
          alert("Company Created Successfully!")
        }else{
          alert("Error While Creating Company")
        }
      }catch{
        alert("Severe ERROR while creating Company");
      }
    }
  }
}
