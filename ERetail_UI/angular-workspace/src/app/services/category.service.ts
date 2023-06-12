import { Observable, of } from 'rxjs';
import { Categories } from '../model/categories';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Companies } from '../model/companies';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private catUrl = 'http://localhost:8080/categories';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ){ }

  private log(message: string) {
    this.messageService.add('CategoryService: ${message}');
  }

  existingCategoryName(caname:string): Observable<boolean>{
    var finalUrl = this.catUrl+"/exists/"+caname;
    return this.http.get<boolean>(finalUrl);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getCategories(caid:number): Observable<Categories[]>{
    var finalURL = this.catUrl;
    if(caid!=-1){ finalURL = (this.catUrl+'/'+String(caid));}
    return this.http.get<Categories[]>(finalURL).pipe(
        tap(_ => this.log('fetched category of caid:' + String(caid))),
        catchError(this.handleError<Categories[]>('getCategories', []))
      );
  }

  createCategory(caname:string, cadesc:string): Observable<Categories>{
    const PPars = new HttpParams().append("caname",caname)
                                  .append("cadesc",cadesc);
    return this.http.post<Categories>(this.catUrl,null,{params:PPars}).pipe(
        tap(_ => this.log('Created company of coname:' + String(caname))),
        catchError(this.handleError<Categories>('getCompanies'))
      );
  }

  updateCategory(caid:number,caname:string, cadesc:string ):Observable<Categories>{
    const PPars = new HttpParams().append("caid" , caid)
                                  .append("caname",caname)
                                  .append("cadesc",cadesc);
    return this.http.put<Categories>(this.catUrl ,null,{params:PPars}).pipe(
      tap(_ => this.log('Updated category of coname:' + caname)),
      catchError(this.handleError<Categories>('getCompanies'))
    ); 
  }

  deleteCategory(caid:number, caname:string): boolean{
    const param = new HttpParams().append("caid",caid)
                                  .append("caname",caname);
    var retVal = this.http.delete(this.catUrl,{params:param}).subscribe((s) => {
      console.log(s);
    });
    return Boolean(retVal)
  }

}
