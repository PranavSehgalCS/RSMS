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

  deleteCompany(pcode:string, pname:string): boolean{
    const param = new HttpParams().append("pcode", pcode)
                                  .append("pname", pname);
    var retVal = this.http.delete(this.proUrl,{params:param}).subscribe();
    return Boolean(retVal)
  }
}
