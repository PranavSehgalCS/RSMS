package com.eretail.api.eretailapi.persistance.Account;

import java.io.IOException;
import java.sql.SQLException;

import com.eretail.api.eretailapi.model.Account;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountDAO {
    Account createAccount(Account account, int i) throws IOException, SQLException; 
    Account getAccount(String username, String password) throws IOException, SQLException;
    Account updateAccount(Account account) throws IOException, SQLException;
    boolean deleteAccount(int id, String password) throws IOException,SQLException;
}
