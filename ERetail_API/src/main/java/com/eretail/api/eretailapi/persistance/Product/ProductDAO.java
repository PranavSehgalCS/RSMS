package com.eretail.api.eretailapi.persistance.Product;

import java.sql.Date;
import java.io.IOException;
import com.eretail.api.eretailapi.model.Product;
import org.springframework.stereotype.Repository;
@Repository
public interface ProductDAO {
    Boolean createProduct( String pname, String category, String company,
    int stock, double price, Date manufactureDate, Date expiryDate, String description) throws IOException;
    Product[] getProducts(String pcode) throws IOException;
    Boolean updateProduct( String pcode, String pname, String category, String company,
    int stock, double price, Date manufactureDate, Date expiryDate, String description) throws IOException;
    Boolean deleteProduct(String pcode, String pname) throws IOException;
    String formatDate(String date) throws IOException;
    Boolean productNameExists(String pcode) throws IOException;
}

