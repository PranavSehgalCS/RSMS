import { getCookie } from 'typescript-cookie'
export class Account{
    public id: number = 0;
    public username: string = " ";
    public password: string = " ";
    public admin: boolean = false;

    public constructor(init?:Partial<Account>) {
        Object.assign(this, init);
    }


    getAccountCookies():void{
        this.id = Number(getCookie('id'));
        this.username = String(getCookie('username'));
        this.password = String(getCookie('password')); 
        this.admin = (getCookie('admin')=='true');
    }


    isAccCookies():boolean{
        if(getCookie('isAccCookies') =='true'){
            return true;
        }else{
            return false;
        }
    }
}