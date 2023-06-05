
export class Categories{
    public caid:number = 0;
    public caname:string = "";
    public cadesc:string = "";

    public constructor(init?:Partial<Categories>) {
        Object.assign(this, init);
    }
    public getCadesc(retVal:string):string{
        if(retVal.length<=36){
            return retVal;
        }
        return String(retVal.substring(0,33)+"...");
    }
}