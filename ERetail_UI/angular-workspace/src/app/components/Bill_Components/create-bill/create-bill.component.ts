import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Bills } from 'src/app/model/bills';
import { Account } from 'src/app/model/account';
import { Products } from 'src/app/model/products';
import { miniProd } from 'src/app/model/miniProd';
import { Component, OnInit } from '@angular/core';
import { BillService } from 'src/app/services/bill.service';
import { MessageService } from 'src/app/services/message.service';
import { ProductService } from 'src/app/services/product.service';
import { CurrentAccountService } from 'src/app/services/current_account.service';


@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent {
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
      this.CAService.setTitle("Start Sell");
      this.messageService.changeError("");
    }else{
      this.router.navigate(['/login']);
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
  private noProd:Products = new Products;  
  private billder:Bills = new Bills();
  public status:boolean = false;
  public maxVal:number = 0;
  public billID:number = -1;
  public totals:number = 0;
  public mobile:string = "";
  public customer:string = "";
  public paytext:string = "No!";
  public fullForm:boolean = false;
  public showItems:boolean = false;
  public productArray:Products[] = [];
  public curProd:Products=  this.noProd;
  public checkoutArray = new Map<string,miniProd>();
  public sellDate:string[] = this.formatDate(new Date(),0);

///////////////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(){
    this.proService.getProducts("null").subscribe(res => {
      this.productArray = res;
      if(!(this.productArray.length>0)){
        this.messageService.changeError("No Products Created, Please Create A Produt To Proceed");
      }
    });
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
  payChange(){
    this.status = !this.status;
    if(this.status){
      this.paytext = "Yes!";
    }else{
      this.paytext = "No!";
    }
  }
  formatPrice(raw:number){
    return (Math.round(raw*100)/100);
  }
  mapToArr(){
    return Array.from(this.checkoutArray.values());
  }
  mes(mess:string){
    this.messageService.changeError(mess);
  }
  setCurProd(prody:string){
    var ing = document.getElementById("qtyIn");
    if(ing!=null){

    }
    if(prody=='?'){
      this.maxVal = 0;
      this.curProd = this.noProd;
    }else{
      var hold = this.getProduct(prody);
      if(hold!=undefined){
        this.curProd = hold;
        this.maxVal = hold.stock;
      }
    }
  }
  getProduct(pcode:string){
    for(var prod of this.productArray){
      if(prod.pcode==pcode){
        return prod;
      }
    }
    return undefined;
  }
  getCard(nin:string):string{
    var num = Number(nin)%10;
    var retVal:string = "th";
    if(num==1 && Number(nin)!=11){
      retVal = 'st';
    }else if(num==2 && Number(nin)!=12){
      retVal = 'nd';
    }else if(num==3 && Number(nin)!=13){
      retVal = 'rd'
    }
    return (nin+retVal+"\t");
  }
  AmOrPm(inda:string):string{
    var hour:number = Number(inda.split(":")[0]);
    var retVal = inda.substring(0,5);
    if(hour<12){
      return retVal + " AM" 
    }
    if(hour>12){
      retVal = (hour-12)+inda.substring(2,5);
    }
    return retVal + " PM"
  }
  formatDate(inDate:Date, type:number):string[]{
    var retVal:string[] = [];
    var sval:string[] = inDate.toString().split(" ");
    if(type==0){
      retVal[0] = this.getCard(sval[2]) + sval[1] + " "+sval[3];
      retVal[1] = this.AmOrPm(sval[4]);
      return retVal;
    }else{
      retVal[0] = sval[2]+sval[1]+sval[3]+sval[4];
      return retVal;
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
  async initForm(name:string, mobile:string){
    if(name.length==0){
      this.messageService.changeError("Please Enter A Customer Name!!!");
    }else if(mobile.length == 0){
      this.messageService.changeError("Please Enter A Mobile Number!!!");
    }else{
      try{
        this.billID = await this.billService.getBillID();
        if(this.billID!=-1){
          this.mobile = mobile;
          this.customer = name;
          this.sellDate = this.formatDate(new Date(),0);
          this.fullForm = true;
        }
      }catch{
        alert("ERROR While Submitting Form, Please Try Again!!");
      }
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
  async addProduct(prod:string, qtyIn:string){
    var qty:number = Number(qtyIn);
    if(prod == '?'){
      this.mes("Please Select A Product To Add!!");
    }else if(qty<1){
      this.mes("Quantity Must Exceed 0!!");
    }else if(qty>this.maxVal){
      this.mes("Quantity For This product Can't Exceed "+this.maxVal + '!!')
    }else{
      this.mes("");
      this.checkoutArray.set(this.curProd.pcode, this.billService.prodToMini(this.billID,this.curProd,qty));
      this.totals = 0;
      for(var mpro of this.mapToArr()){
        this.totals = (this.totals+(mpro.price*mpro.qty));
      }
      this.totals=this.formatPrice(this.totals);
      this.showItems = true;
    }

  }
///////////////////////////////////////////////////////////////////////////////////////////////////
  removeProduct(delCode:string){
    var temp = this.checkoutArray.get(delCode);
    if(temp!=undefined){
      this.totals = this.formatPrice(this.totals - this.formatPrice(temp.price*temp.qty));
      this.checkoutArray.delete(delCode);
      this.showItems = true;
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
  async checkOut(){
    if(this.checkoutArray.size==0){
      this.mes("Please Add Items To Cart First!!!");
    }else if(confirm("Are you sure you want to checkout?")){
      var success:boolean = false;
      this.billder.bid = this.billID;
      this.billder.name = this.customer;
      this.billder.mobile = this.mobile;
      this.billder.orderDate = String(new Date().getTime());
      this.billder.total = this.totals;
      this.billder.status = this.status;
      this.billder.itemList = this.mapToArr();
      await this.billService.createBill(this.billder).subscribe( res => {
        success = res;
      });
      await this.billService.delay(500);
      if(success){
        alert("Your Sell Was Catalouged Successfully!");
        this.router.navigate(["/bills/view"]);
        location.reload;
      }else{
        alert("ERROR While Creating Bill!")
      }
    }
  }
}
