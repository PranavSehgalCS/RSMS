import { Observable } from 'rxjs';
import { Account } from 'src/app/model/account';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';
import { MessageService } from 'src/app/services/message.service';
import { ProductService } from 'src/app/services/product.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';
import { miniProd } from 'src/app/model/miniProd';

@Component({
  selector: 'app-viewbill',
  templateUrl: './viewbill.component.html',
  styleUrls: ['../../Product_Components/create-product/create-product.component.css']
})
export class ViewbillComponent {
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private billService:BillService,
    public messageService:MessageService,
    private CAService:CurrentAccountService
    ){
    let loadAccount = new Account();
    if(loadAccount.isAccCookies()){
      loadAccount.getAccountCookies();
      this.CAService.setAccount(loadAccount);
      this.CAService.setTitle("Start Sell");
      this.messageService.changeError("");
    }else{
      this.router.navigate(['/login']);
    }
  }

  public curBid:number = -1;
  public curName:string= "";
  public curDate:string = "";
  public curMobile:string ="";
  public curTotal:number = 0;
  public curStatus:boolean=false;
  public curItemList:miniProd[] = [];

  ngOnInit(){
    this.curBid = Number(this.route.snapshot.queryParamMap.get('bid'));
    if(this.curBid==0){
      alert("ERROR! \nNo Parameter 'bid' detected");
    }
    if(this.curBid>0){
      this.billService.getBills(this.curBid).subscribe(res => {
        var temp = res.pop();
        if(temp!=undefined){
          this.curName = temp.name;
          this.curTotal = temp.total;
          this.curMobile = temp.mobile;
          this.curStatus = temp.status;
          this.curDate = String(temp.orderDate);
        }
      });
      this.billService.getStatus(this.curBid).subscribe(res=> {
        var temp = res.pop();
        if(temp!=undefined){
          this.curStatus = temp;
        }
      });
      this.billService.getCart(this.curBid).subscribe(res =>{
        var temp = res.pop();
        if(temp!=undefined){
          this.curItemList = temp;
        }
      });
    }
  }


  properDate():string{
    var temp:Date = new Date(Number(this.curDate));
    var sp = temp.toString().split(" ");
    var retVal = sp[2] + " " + sp[1] + " " + sp[3];
    return retVal;
  }
  async editLocation(editID:number){
    await this.billService.delay(100); 
    this.router.navigate(["/bills/edit"],{queryParams:{bid:editID}});
 }
  }
