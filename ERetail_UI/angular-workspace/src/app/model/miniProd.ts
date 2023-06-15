export class miniProd{
    public cartID:number = 0;
    public  pcode:string = "";
    public  pname:string = "";
    public  price:number = 0;
    public  qty:number = 0;
    public constructor(init?:Partial<miniProd>) {
        Object.assign(this, init);
    }
}