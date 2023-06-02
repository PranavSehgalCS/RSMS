package com.eretail.api.eretailapi.model;

public class Product {
    private int pid;
    private int stock;
    private int price;
    private String pname;
    
    public Product(int pid, int stock, int price, String pname){
        this.pid=pid;
        this.stock=stock;
        this.price=price;
        this.pname=pname;    
    }

    public void setStock(int upStock){
        this.stock = upStock;
    }
    
    public int getID(){
        return this.pid;
    }
    public int getStock(){
        return this.stock;
    }
    public int getPrice(){
        return this.price;
    }
    public String getName(){
        return this.pname;
    }
}
