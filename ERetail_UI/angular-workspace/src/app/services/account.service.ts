import { Observable, of } from 'rxjs';
import { Account } from '../model/account';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private accountUrl = 'http://localhost:8080/accounts';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log(message: string) {
    this.messageService.add(`AccountService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  hashPass(pwd:string): string{
    var shift:number = pwd.length;
    var retVal:string = "";
    for (let i = 0; i<pwd.length; i++) {
      retVal =  String.fromCharCode(pwd.charCodeAt(i)+shift/2) 
                + retVal +
                String.fromCharCode(pwd.charCodeAt(i)+shift);
      shift+=(i+pwd.charCodeAt(i)/3);
    }
    for (let i = 0; i<retVal.length; i++) {
      if(retVal.charAt(i) == "'"){
        retVal = retVal.substring(0,i)+"%"+retVal.substring(i,retVal.length);
      }
    }
    return ("#0xp"+retVal)+"@pass";
  }

  getAccount(name: string, pwd: string): Observable<Account> {
    this.log('getAccount called' + this.accountUrl);
    let Params = new HttpParams().append("name",String(name))
                                  .append("pwd", this.hashPass(pwd));
    return this.http.request<Account>("GET",this.accountUrl,{responseType:"json", params:Params}); 
  }

  addAccount(account: Account): Observable<Account> {
    let Params = new  HttpParams().append("name",String(account.username))
                                  .append("pwd", this.hashPass(account.password)); 
    return this.http.request<Account>("POST",this.accountUrl,{responseType:"json", params:Params});
  }

  updateAccount(account: Account){
    let Params = new  HttpParams().append("name",String(account.username))
                                  .append("pwd", account.password); 
    return this.http.request<Account>("PUT",this.accountUrl,{responseType:"json", params:Params});
  }
  

  deleteAccount(acc:Account): boolean{
    const param = new HttpParams().append("id",acc.id)
                                  .append("pass",acc.password)
                                  .append("name",acc.username);
    var retVal = this.http.delete(this.accountUrl,{params:param}).subscribe((s) => {
      console.log(s);
    });
    return Boolean(retVal)
  }

}