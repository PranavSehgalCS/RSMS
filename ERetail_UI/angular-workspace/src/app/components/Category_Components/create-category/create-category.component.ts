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
    private catService:CategoryService,
    public messageService: MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.messageService.changeError("Enter Category Name & Desription To Continue");
      this.CAService.setTitle("Create Categories");
      this.messageService.changeError("");
    }else{
      this.router.navigate(['/login']);
    }
  }

  private uname:boolean = false;
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async createCategory(caname:string, cadesc:string){
    caname = caname.trim().replaceAll("'","");
    cadesc = cadesc.trim().replaceAll("'","");
    if(caname.length==0){
      this.messageService.changeError("Please Enter A Category Name");
    }else if(cadesc.length==0){
      this.messageService.changeError("Please Enter A Category Description");
    }else if(caname.length>48){
      this.messageService.changeError("Category Name Can't Be Longer Than 48 Chars");
    }else if(cadesc.length>256){
      this.messageService.changeError("Category Description Can't Be Longer Than 256 Chars");
    }else{
      try{
        await this.catService.existingCategoryName(caname).subscribe(res=>{this.uname = !res;});
        await this.delay(50);
        if(this.uname){
          var retVal = await this.catService.createCategory(caname, cadesc).subscribe(); 
          if(retVal!=null){
            alert("Category Created Successfully!");
            this.messageService.changeError("");
          }else{
            alert("Error While Creating Category");
          }
        }else{
          this.messageService.changeError("Category Name Already Exists");
        }
      }catch{
        alert("Severe ERROR while creating Category");
      }
    }
  } 
}
