import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Account } from 'src/app/model/account';
import { ActivatedRoute } from '@angular/router';
import { Categories } from 'src/app/model/categories';
import { MessageService } from 'src/app/services/message.service';
import { CategoryService } from 'src/app/services/category.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['../create-category/create-category.component.css']
})


export class EditCategoryComponent {
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private CatService:CategoryService,
    public messageService: MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.messageService.changeError("{}")
      this.CAService.setTitle("Edit Categories");
    }else{
      this.router.navigate(['/login']);
    }
  }
  private error:boolean = true;
  public curCaid:number = -1;
  public curCaname:string ="";
  public curCadesc:string ="";
  public Heading:string = "Getting Category Data From Backend ...";

  ngOnInit() {
    this.curCaid = Number(this.route.snapshot.queryParamMap.get('caid'));
    this.CatService.getCategories(this.curCaid).subscribe(res => {
      var CurVal = res.pop();
      if(CurVal!=null){
        this.error = false;
        this.curCaid = CurVal.caid;
        this.curCaname = CurVal.caname;
        this.curCadesc = CurVal.cadesc;
        this.Heading = ("Editing Category of ID : "+String(this.curCaid));
      }else{
        this.error = true;
        this.Heading = ("ERROR!!!");
        this.messageService.changeError(("No Category  With ID : "+String(this.curCaid) + ' Found')); 
      }
    });
  }


  async editCategory(caname:string, cadesc:string){
    caname =  caname.trim().replaceAll("'","");;
    cadesc = cadesc.trim().replaceAll("'","");;
    try{
      if(this.error){
        this.messageService.changeError("Unable To Edit Category");
      }else if(caname.length==0){
        this.messageService.changeError("Please Enter A Category Name");
      }else if(caname.length>46){
        this.messageService.changeError("Category Name Can't Exceed 46 Chars");
      }else if(cadesc.length==0){
        this.messageService.changeError("Please Enter A Category Description");
      }else if(cadesc.length>256){
        this.messageService.changeError("Category Name Can't Exceed 256 Chars");
      }else{
        this.CatService.updateCategory(this.curCaid, caname,cadesc).subscribe( res =>{
          var respVal = res;
          if( (respVal.caname == caname) && (respVal.cadesc == cadesc) ){
            alert("Category Updated Successfuly!");
          }
        });
      }
    }catch{

    }
  }
}
