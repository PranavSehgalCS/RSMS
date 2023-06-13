package com.eretail.api.eretailapi.model;

public class miniProd {
    private int cartID;
    private String pcode;
    private String pname;
    private double price;
    private int qty;

    public miniProd(int cartID, String pcode, String pname, double price, int qty){
        this.cartID = cartID;
        this.pcode = pcode;
        this.pname = pname;
        this.price = price;
        this.qty = qty;
    }
    
    public int getCartID(){
        return this.cartID;
    }
    public String getPcode(){
        return this.pcode;
    }
    public String getPname(){
        return this.pname;
    }
    public double getPrice(){
        return this.price;
    }
    public int getQty(){
        return this.qty;
    }
    public String toString(){
        return (this.pcode+this.pname+this.price+this.qty);
    }

}
