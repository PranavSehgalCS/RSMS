export class Companies{
    public coid:number = 0;
    public coname:string = "";
    public codesc:string = "";

    public constructor(init?:Partial<Companies>) {
        Object.assign(this, init);
    }
}