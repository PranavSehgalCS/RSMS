package com.eretail.api.eretailapi.persistance.Account;

import java.sql.ResultSet;
import java.sql.Statement;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.DriverManager;

import org.springframework.stereotype.Component;
import com.eretail.api.eretailapi.model.Account;
import org.springframework.beans.factory.annotation.Value;
@Component
public class AccountFileDAO implements AccountDAO{
    private String database;
    private String datauser;
    private String datapass;
    private String getIdString = "SELECT MAX(id) AS maid FROM accounts ";
    private static int nextId; 

    public AccountFileDAO(@Value("${spring.datasource.url}") String database ,
                        @Value("${spring.datasource.username}") String datauser,
                        @Value("${spring.datasource.password}") String datapass
                        ) throws IOException, SQLException {
        this.database = database;
        this.datauser = datauser;
        this.datapass = datapass;
        AccountFileDAO.nextId = -1;
    }

    private ResultSet load(String argument) throws IOException, SQLException {
        try {
            return DriverManager.getConnection(database,datauser,datapass).createStatement().executeQuery(argument);
        }catch (Exception e) {
            System.out.println("\n Error While Loading  ->  "+e);
        }
        return null;
    }

    private boolean save(String arg,String arg2, int i) throws IOException, SQLException {
        try{
            String finalArg = "INSERT INTO accounts (id, username, password, isAdmin ) VALUES(" +arg + ");";
            if(i==1){
                finalArg = ("UPDATE accounts SET password = '" + arg + "' WHERE username = '" + arg2+"';");
            }else if(i>5){
                finalArg = ("DELETE FROM accounts WHERE id = "+i+" AND password = '"+arg+"';");
            }else if(i<=5 && i>1){
                return false;
            }
            Statement statement =  DriverManager.getConnection(database,datauser,datapass).createStatement();
            statement.executeUpdate(finalArg);
            statement.close();
            return true;
        }catch(Exception e){
            System.out.println("\nError caught! -> \n\t\t in save(String)" +  e + "\n");
            return false;
        }
    }

    public Account createAccount(Account account,int i) throws IOException, SQLException {
        if(account!=null && nextId>5){
            try {
                if(load("SELECT id FROM accounts WHERE username = '"+account.getUsername()+"';").next()){
                    return new Account(3, "", " ", false);
                }
            } catch (Exception e) {
                return new Account(2, "", " ", false);
            }
            int idVal = (int)(AccountFileDAO.nextId); 
            String values = Integer.toString( AccountFileDAO.nextId )+", '";
            values+= account.getUsername() + "', '" +account.getPassword() + "', 'false'";
            if(save(values,null,0)){
                AccountFileDAO.nextId++;
                return new Account( idVal, account.getUsername(), account.getPassword(), false);
            }
        }else{
            if(nextId<5 && i>0){
                try{
                    ResultSet r = load(getIdString);
                    r.next();
                    AccountFileDAO.nextId = (Integer)(r.getInt("maid") + 1);
                    r.close();
                    createAccount(account, i-1);
                }catch(Exception e){
                    return new Account(2, "", " ", false);
                }
            }
        }
        return account;
    };

    public Account getAccount(String username, String password){
        Account retvalAccount = null;
        try {
            ResultSet result = load("SELECT* FROM accounts WHERE username = '" + username + "';");
            if(result!=null){
                if(result.next()){
                    if(!(result.getString("password").equals(password))){
                        retvalAccount = new Account(1, " ", " ", false);
                    }else{
                        retvalAccount = new Account(result.getInt("id"),
                                                    result.getString("username"),
                                                    result.getString("password"),
                                                    result.getBoolean("isAdmin")
                                        );
                    }
                }else{
                    retvalAccount = new Account(0, "", " ", false);
                }
                result.close();
            }else{
                retvalAccount = new Account(2, "", " ", false);
            }
        } catch (Exception e) {
            System.out.println("State -> BAD! "+ e);
        }
        return retvalAccount;
    }

    public Account updateAccount(Account account) throws IOException, SQLException {
        if(!save(account.getPassword(),account.getUsername(),1)){
            return null;
        }
        return account;
    };

    public boolean deleteAccount(int id,String passString) throws IOException, SQLException {
        return save(passString,null,id);
    }
}
