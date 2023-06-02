package com.eretail.api.eretailapi.model;

public class Category {
    private int caid;
    private String caname;
    private String cadesc;

    public Category(int caid, String caname, String cadesc){
        this.caid=caid;
        this.caname=caname;
        this.cadesc=cadesc;
    }

    public int getCaid() {
        return caid;
    }
    public String getCaname() {
        return caname;
    }
    public String getCadesc() {
        return cadesc;
    }

    
}
