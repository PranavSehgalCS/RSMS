import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { MessageService } from 'src/app/services/message.service';
import { CategoryService } from 'src/app/services/category.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';
import { Categories } from 'src/app/model/categories';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent {
  constructor(
    private router:Router,
    private CatService:CategoryService,
    public messageService: MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.messageService.changeError("Enter Category Name & Desription To Continue");
      this.CAService.setTitle("Create Categories");
    }else{
      this.router.navigate(['/login']);
    }
  }

  async createCategory(coname:string, codesc:string){
    coname = coname.trim().replaceAll("'","");
    codesc = codesc.trim().replaceAll("'","");;
    if(coname.length==0){
      this.messageService.changeError("Please Enter A Category Name");
    }else if(codesc.length==0){
      this.messageService.changeError("Please Enter A Category Description");
    }else if(coname.length>48){
      this.messageService.changeError("Category Name Can't Be Longer Than 48 Chars");
    }else if(codesc.length>256){
      this.messageService.changeError("Category Description Can't Be Longer Than 256 Chars");
    }else{
      try{
        var retVal = await this.CatService.createCategory(coname, codesc).subscribe();
        if(retVal!=null){
          alert("Category Created Successfully!")
        }else{
          alert("Error While Creating Category")
        }
      }catch{
        alert("Severe ERROR while creating Category");
      }
    }
  } 
}
