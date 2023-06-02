package com.eretail.api.eretailapi.model;

public class Account {
    public static final String STRING_FORMAT = "Account [Username=%s, Premium=%s]";

    private int id;
    private String username;
    private String password;
    private boolean isAdmin;

    public Account(int id, String username, String password, boolean isAdmin) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    public int getID(){
        return this.id;
    }
    public String getUsername(){
        return this.username;
    }
    public String getPassword(){
        return this.password;
    }
    public boolean isPassword(String password){
        if(this.password.equals(password)){
            return true;
        }
        return false;
    }

    public boolean getAdmin(){
        return this.isAdmin;
    }
}