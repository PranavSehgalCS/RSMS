import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Products } from '../model/products';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private proUrl = 'http://localhost:8080/products';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ){ }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getProducts(pcode:string): Observable<Products[]>{
    var finalUrl = this.proUrl; 
    if(pcode!="null"){ finalUrl = this.proUrl+'/'+String(pcode); }
    return this.http.get<Products[]>(finalUrl).pipe(
        catchError(this.handleError<Products[]>([]))
      );
  }

  existingProductName(pname:string): Observable<boolean>{
    var finalUrl = this.proUrl+"/exists/"+pname;
    return this.http.get<boolean>(finalUrl);
  }
  
  getProductDates(pcode:string): Observable<string[]>{
    var finalUrl = this.proUrl+'/getdate/'+String(pcode);
    var retVal:Observable<string[]> = this.http.get<string[]>(finalUrl).pipe(
        catchError(this.handleError<string[]>([]))
      );
    return retVal;
  }

  createProduct(pname:string, category:string, company:string, stock:number, 
    price:number, mnfdate:string, expdate:string, description:string): boolean{
    const param = new HttpParams().append("pname", pname )
                                  .append("category", category)
                                  .append("company", company)
                                  .append("stock", String(stock))
                                  .append("price", String(price))
                                  .append("mnfdate", mnfdate)
                                  .append("expdate", expdate)
                                  .append("description", description)                       
    var retVal = this.http.post(this.proUrl,null,{params:param}).subscribe();
    return Boolean(retVal)
  }


  updateProduct(pcode:string, pname:string, category:string, company:string, stock:number, 
    price:number, mnfdate:string, expdate:string, description:string): boolean{
    const param = new HttpParams().append("pcode", pcode )
                                  .append("pname", pname )
                                  .append("category", category)
                                  .append("company", company)
                                  .append("stock", String(stock))
                                  .append("price", String(price))
                                  .append("mnfdate", mnfdate)
                                  .append("expdate", expdate)
                                  .append("description", description)                       
    var retVal = this.http.put(this.proUrl,null,{params:param}).subscribe();
    return Boolean(retVal)
  }
  deleteProduct(pcode:string, pname:string): boolean{
    const param = new HttpParams().append("pcode", pcode)
                                  .append("pname", pname);
    var retVal = this.http.delete(this.proUrl,{params:param}).subscribe();
    return Boolean(retVal)
  }
}
