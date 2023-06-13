package com.eretail.api.eretailapi.persistance.Bill;

import java.sql.Date;
import java.io.IOException;
import java.sql.SQLException;
import com.eretail.api.eretailapi.model.Bill;
import com.eretail.api.eretailapi.model.miniProd;
import org.springframework.stereotype.Repository;


@Repository
public interface BillDAO {
    miniProd[] formatItems(String itemString);
    String formatDate(String indate);
    Boolean createBill(String name, String mobile, Date orderDate,double total, boolean status, miniProd[] items) throws IOException,SQLException;
    Bill[] getBills(int bid) throws IOException,SQLException;
    Boolean updateBill(int bid, String name, String mobile, Date orderDate,double total, boolean status, miniProd[] items) throws IOException,SQLException;
    Boolean deleteBill(int bid) throws IOException;
}
