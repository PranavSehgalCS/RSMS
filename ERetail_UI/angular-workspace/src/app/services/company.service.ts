import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Companies } from '../model/companies';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { r3JitTypeSourceSpan } from '@angular/compiler';

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
    var finalUrl = this.comUrl; 
    if(coid!=-1){ finalUrl = this.comUrl+'/'+String(coid); }
    return this.http.get<Companies[]>(finalUrl).pipe(
        tap(_ => this.log('fetched category of caid:' + String(coid))),
        catchError(this.handleError<Companies[]>('getCompanies', []))
      );
  }

  createCompany(coname:string, codesc:string): Observable<Companies>{
    const PPars = new HttpParams().append("coname",coname)
                                  .append("codesc",codesc);
    return this.http.post<Companies>(this.comUrl,null,{params:PPars}).pipe(
        tap(_ => this.log('Created company of coname:' + String(coname))),
        catchError(this.handleError<Companies>('getCompanies'))
      );
  }

  updateCompany(coid:number,coname:string, codesc:string ):Observable<Companies>{
    const PPars = new HttpParams().append("coid" , coid)
                                  .append("coname",coname)
                                  .append("codesc",codesc);
    return this.http.put<Companies>(this.comUrl ,null,{params:PPars}).pipe(
      tap(_ => this.log('Updated category of coname:' + coname)),
      catchError(this.handleError<Companies>('getCompanies'))
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
