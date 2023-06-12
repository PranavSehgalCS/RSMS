package com.eretail.api.eretailapi.persistance.Product;
import java.sql.Date;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.io.IOException;
import java.sql.DriverManager;
import org.springframework.stereotype.Component;
import com.eretail.api.eretailapi.model.Product;
import org.springframework.beans.factory.annotation.Value;

@Component
public class ProductFileDAO implements ProductDAO{
    private String database;
    private String datauser;
    private String datapass;
    private static int nextID = 1;
    private Boolean updated = false;
    private ArrayList<Product> productArray;
    private ArrayList<Integer> avalibleID= new ArrayList<Integer>();

    public ProductFileDAO(  @Value("${spring.datasource.url}") String database,
                            @Value("${spring.datasource.username}") String datauser,
                            @Value("${spring.datasource.password}") String datapass
                            ) throws IOException{
        this.database=database;
        this.datauser=datauser;
        this.datapass=datapass;
        if(loadProducts()){
            this.updated=true;
        }
    }

    private String formatPcode(int pcode){
        String n = Integer.toString(pcode);
        n = "0".repeat(3-n.length()) + n;
        return "M1"+n;
    }
    private int deformatPcode(String pcode){
        return Integer.valueOf(pcode.substring(2, 5));
    }

    String quote(String s){
        return (" '"+s+"', ");
    }

    String UpProd(String pcode, String field, String value, int i){
        if(i==0){
            return ("UPDATE products SET " + field + "= '" + value + "' WHERE pcode = '" + pcode + "';");
        }
        return ("UPDATE products SET " + field + "= " + value + " WHERE pcode = '" + pcode + "';"); 
    }

    private Boolean loadProducts() throws IOException{
        try {
            this.productArray = new ArrayList<Product>();
            String loader = "SELECT * FROM products ORDER BY pcode;";
            ResultSet load = DriverManager.getConnection(database,datauser,datapass).createStatement().executeQuery(loader);
            Product arrayObj = null;
            while(load.next()){
                arrayObj= new Product(  load.getString("pcode"),
                                        load.getString("pname"),
                                        load.getString("category"),
                                        load.getString("company"),
                                        load.getInt("stock"),
                                        load.getDouble("price"),
                                        load.getDate("mnfdate"),
                                        load.getDate("expdate"),
                                        load.getString("description"));
                productArray.add(arrayObj);
            }
            if(arrayObj!=null){ProductFileDAO.nextID = (deformatPcode(arrayObj.getPcode())+1);}
            return true;
        } catch (Exception e) {
            System.out.println("\n Error While Loading Products ->  " + e);
        }
        return false;
    }

    private Boolean saveProducts(String command) throws IOException{
        try {
            Statement statement =  DriverManager.getConnection(database,datauser,datapass).createStatement();
            int i = statement.executeUpdate(command);
            if(i<1){return false;}
            this.updated = false;
            return true;
        }catch(Exception e){
            System.out.println("\n Error While Saving Products ->  " + e); 
            return false;
        }
    }

    
    @Override
    public Boolean createProduct( String pname, String category, String company,
    int stock, double price, Date manufactureDate, Date expiryDate, String description) throws IOException{
        String pcode;
        if(this.avalibleID.size()>0){
            pcode = formatPcode( avalibleID.get(0) );
            this.avalibleID.remove(0);
        }else{       
            ProductFileDAO.nextID++;
            pcode = formatPcode(ProductFileDAO.nextID - 1); 
        }
        String cmd = "INSERT INTO products VALUES(" + quote(pcode) + quote(pname) + quote(category) + quote(company) + Integer.toString(stock)
                    + ", " + Double.toString(price) + ", " + quote(manufactureDate.toString()) + quote(expiryDate.toString()) + " '" +description + "');";
        if(saveProducts(cmd)){
            return true;
        }
        return false;
    }

    @Override
    public Product[] getProducts(String pcode) throws IOException{
        int index=-1;
        if(!updated){ updated = loadProducts(); }
        if(!pcode.equals("null")){
            Product[] retVal =  new Product[1];
            for(Product i: this.productArray){
                if(i.getPcode().equals(pcode)){
                    retVal[0] = i;
                    return retVal;
                }
            }
            return null;
        }
        Product[] retVal =  new Product[this.productArray.size()];
        for(Product i: this.productArray){
            index++;
            retVal[index]=i;
        }
        return retVal;
    }

    @Override
    public Boolean updateProduct( String pcode, String pname, String category, String company,
    int stock, double price, Date manufactureDate, Date expiryDate, String description) throws IOException{
        if(!updated){ updated = loadProducts(); }
        Product up = null;
        Boolean retVal =true;
        for(Product i:productArray){
            if(i.getPcode().equals(pcode)){
                up = i;
                break;
            }
        }
        if(up == null){return null;}

        
        if(!up.getPname().equals(pname)){
            retVal = retVal && saveProducts(UpProd(pcode, "pname", pname,0 ));
        }
        if(!up.getCategory().equals(category)){
            retVal = retVal && saveProducts(UpProd(pcode, "category", category,0 ));
        }
        if(!up.getCompany().equals(company)){
            retVal = retVal && saveProducts(UpProd(pcode, "company", company,0 ));
        }
        if(! (up.getStock() == stock)){
            retVal = retVal && saveProducts(UpProd(pcode, "stock", Integer.toString(stock),1 ));
        }
        if(!(up.getPrice() == price)){
            retVal = retVal && saveProducts(UpProd(pcode, "price", Double.toString(price),1 ));
        }
        if(!up.getManufactureDate().equals(manufactureDate.toString())){
            retVal = retVal && saveProducts(UpProd(pcode, "mnfdate", manufactureDate.toString() ,0 ));
        }
        if(!up.getExpiryDate().equals(expiryDate.toString())){
            retVal = retVal && saveProducts(UpProd(pcode, "expdate", expiryDate.toString(),0 ));
        }
        if(!up.getDescription().equals(description)){
            retVal = retVal && saveProducts(UpProd(pcode, "description", description,0 ));
        }

        return retVal;
    }

    @Override
    public Boolean deleteProduct(String pcode, String pname) throws IOException {
        String cmd = "DELETE FROM products WHERE pcode =" + " '" + pcode + "' AND pname =" + " '"+ pname + "' ;";
        if(saveProducts(cmd)){
            this.avalibleID.add(deformatPcode(pcode));
            return true;
        }
        return false;
    }

    @Override
    public String formatDate(String date) throws IOException {
        try{
            String[] spliten = date.split("-");
            String retVal = spliten[2] + "-" + spliten[1] + "-" + spliten[0];
            return retVal;
        }catch (Exception e) {
            System.out.println("Error while reformatting date --> " + e);
            return "00-00-00";
        }
    }

    @Override
    public Boolean productNameExists(String pname) throws IOException{
        if(!updated){updated = loadProducts();}
        for(Product i: productArray){
            if(i.getPname().equals(pname)){
                return true;
            }
        }
        return false;
    }
    
}
