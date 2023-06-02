package com.eretail.api.eretailapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eretail.api.eretailapi.model.Account;
import com.eretail.api.eretailapi.persistance.Account.AccountDAO;

import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;


@RestController
@RequestMapping("accounts")
public class LoginController {
    private AccountDAO loginDao;
    private static final Logger LOG = Logger.getLogger(LoginController.class.getName());

    public LoginController(AccountDAO loginDao) {
        this.loginDao = loginDao;
    }

    @GetMapping("")
    public ResponseEntity<Account> getAccount(  @RequestParam(name = "name", required = true) String name, 
                                                @RequestParam(name = "pwd" , required = true) String pwd
                                            ) throws SQLException {
        LOG.info("GET /accounts/" + name+"/");
        try {
            Account account = loginDao.getAccount(name, pwd);
            if(account != null){
                return new ResponseEntity<Account>(account ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(IOException e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("")
    public ResponseEntity<Account> createAccount(   @RequestParam(name = "name", required = true) String name, 
                                                    @RequestParam(name = "pwd" , required = true) String pwd
                                                ) throws SQLException {
        Account account = new Account(0, name, pwd, false);
        LOG.info("POST /accounts/" + name + "/");
        try{
            Account accountNew = (Account) loginDao.createAccount(account,1);
            if(accountNew != null){
                return new ResponseEntity<Account>(accountNew, HttpStatus.CREATED);
            }
            else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        }
        catch(IOException e){
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

   
    @PutMapping("")
    public ResponseEntity<Account> updateAccount(   @RequestParam(name = "name", required = true) String name, 
                                                    @RequestParam(name = "pwd" , required = true) String pwd
                                                ) throws SQLException {
        Account account = new Account(0, name, pwd, false);
        LOG.info("PUT /accounts/" + name + "/");
        try{
            Account update = loginDao.updateAccount(account);
            if(update != null){
                return new ResponseEntity<Account>(account, HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(IOException e){
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("")
    public ResponseEntity<Boolean> deleteAccount(   @RequestParam(name = "id"  , required = true) Integer id,
                                                    @RequestParam(name = "pass", required = true) String  pass,
                                                    @RequestParam(name = "name", required = true) String  name
                                                    ) throws SQLException {
        LOG.info("DELETE /accounts/" + id +":"+ name);
        try{
            boolean deleted = loginDao.deleteAccount(id,pass);
            if(deleted){
                return new ResponseEntity<Boolean>(deleted,HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}