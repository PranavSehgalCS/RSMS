import { miniProd } from "./miniProd";
export class Bills{
    public bid:number = 0;
    public name:string = "";
    public mobile:string = "'";
    public orderDate:string = "";
    public total:number = 0;;
    public status:boolean = false;
    public itemList:miniProd[] = [];

    public constructor(init?:Partial<Bills>) {
        Object.assign(this, init);
    }
}