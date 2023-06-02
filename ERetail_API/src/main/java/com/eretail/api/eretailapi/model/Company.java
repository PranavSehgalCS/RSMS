package com.eretail.api.eretailapi.model;

public class Company{
    private int coid;
    private String coname;
    private String codesc;
    
    public Company(int coid, String coname, String codesc){
        this.coid=coid;
        this.coname=coname;
        this.codesc=codesc;
    }

    
    public int getCoid() {
        return coid;
    }
    public String getConame() {
        return coname;
    }
    public String getCodesc() {
        return codesc;
    }
}
