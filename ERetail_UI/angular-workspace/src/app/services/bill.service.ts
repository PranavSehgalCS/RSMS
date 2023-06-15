import { Bills } from '../model/bills';
import { Injectable } from '@angular/core';
import { miniProd } from '../model/miniProd';
import { Products } from '../model/products';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BillService {
  private retInt:number = -1;
  private billUrl = 'http://localhost:8080/bills';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ){}
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  prodToMini(billID:number, prod:Products, qty:number){
    var retVal:miniProd =  new miniProd();
    retVal.qty = qty;
    retVal.cartID = billID;
    retVal.pcode = prod.pcode;
    retVal.pname = prod.pname;
    retVal.price = prod.price;
    return retVal;
   }

  async getBillID():Promise<number>{
    var finalUrl = this.billUrl+'/currentid/';
    await this.http.get<number>(finalUrl).pipe().subscribe(res =>{
      if(res!=undefined){this.retInt=res;}
    });
    await this.delay(200);
    return this.retInt
  }

  async getBills(bid:number):Promise<Bills[]>{
    var retVal:Bills[] = [];
    var finalUrl:string = this.billUrl;
    if(bid!=0){finalUrl = finalUrl + "/" +String(bid);}
    await this.http.get<Bills[]>(finalUrl).pipe().subscribe(res =>{retVal = res;});
    await this.delay(200);
    return retVal;
  }

  private formatItems(items:miniProd[]):string{
    var itemString = "";
    var retVal:string = "";
    var firstForm:boolean = true;
    for(var item of items){
      itemString = ";("
      if(firstForm){
        firstForm=!firstForm;
        itemString = "(";
      }
      itemString = (itemString +  item.cartID + ',' + item.pcode + ',' + item.pname.replace(",","‚") + ',' + item.price + ',' + item.qty + ')');
      retVal = (retVal+itemString);
    }

    return retVal;
  }

  createBill(bill:Bills):Observable<boolean>{
    var retVal:string= 'false';
    const param = new HttpParams().append("name", bill.name)
                                  .append("mobile", bill.mobile)
                                  .append("date", bill.orderDate)
                                  .append("total", bill.total.toString())
                                  .append("paid", bill.status)
                                  .append("items", this.formatItems(bill.itemList));
    return this.http.post<boolean>(this.billUrl,null,{params:param});
  }

  async updateBill(bill:Bills):Promise<Boolean>{
    var retVal:boolean = false;
    const param = new HttpParams().append("bid", bill.bid)
                                  .append("name", bill.name)
                                  .append("mobile", bill.mobile)
                                  .append("date", bill.orderDate)
                                  .append("total", bill.total.toString())
                                  .append("paid", bill.status)
                                  .append("items", this.formatItems(bill.itemList));
    await this.http.put<boolean>(this.billUrl,null,{params:param}).subscribe(res => {retVal = res;});
    await this.delay(200);
    return retVal;
  }

  async deleteBill(bid:number):Promise<boolean>{
    var retVal:boolean = false;
    var finalUrl = this.billUrl + '/' + bid;
    await this.http.delete<boolean>(finalUrl).subscribe(res => {retVal = res;});
    await this.delay(200);
    return retVal;
  }

}
