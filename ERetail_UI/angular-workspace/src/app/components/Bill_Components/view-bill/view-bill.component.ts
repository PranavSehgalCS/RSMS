import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Account } from 'src/app/model/account';
import { Component, OnInit } from '@angular/core';
import { BillService } from 'src/app/services/bill.service';
import { MessageService } from 'src/app/services/message.service';
import { ProductService } from 'src/app/services/product.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';
import { Bills } from 'src/app/model/bills';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['../../Product_Components/view-product/view-product.component.css']
})
export class ViewBillComponent {
  constructor(
    private router:Router,
    private billService:BillService,
    private proService: ProductService,
    public messageService:MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("Sells Report");
      this.messageService.changeError("");
    }else{
      this.router.navigate(['/login']);
    }
  }
  public loadShow:number = 0;
  public headNum:number = 0;
  public billArray:Bills[] = [];

  async ngOnInit() {
    this.loadShow = 0;
    await this.billService.getBills(-1).subscribe(res => {
      this.billArray = res;
      this.headNum = this.billArray.length;
      this.loadShow++;
    });
    await this.billService.getStatus(-1).subscribe(res => {
      for(var i = 0;i<res.length;i++){
        this.billArray[i].status = res[i];
      }
      this.loadShow ++;
    });
    await this.billService.getCart(-1).subscribe(res => {
      for(var i = 0;i<res.length;i++){
        this.billArray[i].itemList = res[i];
      }
    });
    this.loadShow ++;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  btos(inval:boolean):String{
    if(inval){
      return "Paid!"
    }
    return "Payment Pending";
  }
  hihi(val:boolean):string{
    if(val){
      return "width: 10rem; height:0px; margin-top:0px;";
    }else{
      return "width: 10rem; height:0px; margin-top:10px;";
    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  async viewLocation(gotoID:number){
    await this.billService.delay(100); 
    this.router.navigate(["bills/viewbill"],{queryParams:{bid:gotoID}});
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  async editLocation(editID:number){
     await this.billService.delay(100); 
      this.router.navigate(["/bills/edit"],{queryParams:{bid:editID}});
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
}
