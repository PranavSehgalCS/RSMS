export class Products{
    public pcode:string = "";
    public pname:string = "";
    public category:string = "";
    public company:string = "";
    public stock:number = 0;
    public price:number = 0;
    public mnfdate:string = "";
    public expdate:string = ""; 
    public description:string = "";

    public constructor(init?:Partial<Products>) {
        Object.assign(this, init);
    }


}