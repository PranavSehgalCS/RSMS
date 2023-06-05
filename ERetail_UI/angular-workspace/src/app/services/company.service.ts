import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Companies } from '../model/companies';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private comUrl = 'http://localhost:8080/companies';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ){ }

  private log(message: string) {
    this.messageService.add('CompanyService: ${message}');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getCompanies(coid:number): Observable<Companies[]>{
    if(coid==-1){
      return this.http.get<Companies[]>(this.comUrl)
      .pipe(
        tap(_ => this.log('fetched all categories')),
        catchError(this.handleError<Companies[]>('getCategories', []))
      );
    }
    return this.http.get<Companies[]>((this.comUrl+'/'+String(coid)))
      .pipe(
        tap(_ => this.log('fetched category of caid:' + String(coid))),
        catchError(this.handleError<Companies[]>('getCompanies', []))
      );
  }

  deleteCompany(coid:number, coname:string): boolean{
    const param = new HttpParams().append("coid",coid)
                                  .append("coname",coname);
    var retVal = this.http.delete(this.comUrl,{params:param}).subscribe((s) => {
      console.log(s);
    });
    return Boolean(retVal)
  }

}
