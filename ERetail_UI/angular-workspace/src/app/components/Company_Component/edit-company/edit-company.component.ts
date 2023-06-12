import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'src/app/services/message.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';
@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['../../Category_Components/create-category/create-category.component.css']
})

export class EditCompanyComponent {
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private ComService:CompanyService,
    public messageService: MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.messageService.changeError("")
      this.CAService.setTitle("Edit Companies");
    }else{
      this.router.navigate(['/login']);
    }
  }
  private error:boolean = true;
  public curCoid:number = -1;
  public curConame:string ="";
  public curCodesc:string ="";
  public Heading:string = "Getting Company Data From Backend ...";

  ngOnInit() {
    this.curCoid = Number(this.route.snapshot.queryParamMap.get('coid'));
    this.ComService.getCompanies(this.curCoid).subscribe(res => {
      var CurVal = res.pop();
      if(CurVal!=null){
        this.error = false;
        this.curCoid = CurVal.coid;
        this.curConame = CurVal.coname;
        this.curCodesc = CurVal.codesc;
        this.Heading = ("Editing Company of ID : "+String(this.curCoid));
      }else{
        this.error = true;
        this.Heading = ("ERROR!!!");
        this.messageService.changeError(("No Company With ID : "+String(this.curCoid) + ' Found')); 
      }
    });
  }

  private uname:boolean = false;
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async editCompany(coname:string, codesc:string){
    coname =  coname.trim().replaceAll("'","");
    codesc = codesc.trim().replaceAll("'","");
    if(coname == '?'){
      coname = '<\Q>'
    }
    try{
      if(this.error){
        this.messageService.changeError("Unable To Edit Company");
      }else if(coname.length==0){
        this.messageService.changeError("Please Enter A Company Name");
      }else if(coname.length>46){
        this.messageService.changeError("Company Name Can't Exceed 46 Chars");
      }else if(codesc.length==0){
        this.messageService.changeError("Please Enter A Company Description");
      }else if(codesc.length>256){
        this.messageService.changeError("Company Name Can't Exceed 256 Chars");
      }else{
        if(this.curConame == coname){
          this.uname=true;
        }else{
          await this.ComService.existingCompanyName(coname).subscribe(res=>{this.uname = !res;});
        }
        await this.delay(50);
        if(this.uname){
          var retVal = await this.ComService.updateCompany(this.curCoid, coname, codesc).subscribe(); 
          if(retVal!=null){
            this.curConame = coname;
            this.messageService.changeError("");
            alert("Company Updated Successfully!");
          }else{
            alert("Error While Creating Company");
          }
        }else{
          this.messageService.changeError("Company Name Already Exists");
        }
      }
    }catch{
      alert("Error While Updating Company");
    }
  }
}
