package com.eretail.api.eretailapi.model;

import java.sql.Date;

public class Bill {
    private int bid;
    private String name;
    private String mobile;
    private Date orderDate;
    private double total;
    private boolean status;
    private miniProd[] itemList;

    public Bill(int bid, String name, String mobile, Date date,double total, boolean status, miniProd[] items){
        this.bid = bid;
        this.mobile = mobile;
        this.total = total;
        this.orderDate = date;
        this.status = status;
        this.name = name;
        this.itemList = items;
    }

    public int getBid(){
        return this.bid;
    }
    public String getMobile(){
        return this.mobile;
    }
    public double getTotal(){
        return this.total;
    }
    public Date getOrderDate(){
        return this.orderDate;
    }
    public Boolean isPaid(){
        return this.status;
    }
    public String getName(){
        return this.name;
    }
    public miniProd[] getItems(){
        return itemList;
    }
}
