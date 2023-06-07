package com.eretail.api.eretailapi.model;

import java.sql.Date;

public class Product {
    private String pcode;
    private String pname;
    private String category;
    private String company;
    private int stock;
    private double price;
    private Date manufactureDate;
    private Date expiryDate;
    private String description;
    
    public Product(String pcode, String pname, String category, String company,
                    int stock, double price, Date manufactureDate, Date expiryDate, String description){
        this.pcode = pcode;
        this.pname = pname;
        this.category = category;
        this.company = company;
        this.stock = stock;
        this.price = price;
        this.manufactureDate = manufactureDate;
        this.expiryDate = expiryDate;
        this.description = description;   
    }

    public String getPcode(){
        return this.pcode;
    }
    public String getPname(){
        return this.pname;
    }
    public String getCategory(){
        return this.category;
    }
    public String getCompany(){
        return this.company;
    }
    public int getStock(){
        return this.stock;
    }
    public double getPrice(){
        return this.price;
    }
    public String getManufactureDate(){
        return this.manufactureDate.toString();
    }
    public String getExpiryDate(){
        return this.expiryDate.toString();
    }
    public String getDescription(){
        return this.description;
    }
}
