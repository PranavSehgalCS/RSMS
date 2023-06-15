package com.eretail.api.eretailapi.persistance.Bill;

import java.sql.Connection;
import java.sql.Date;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.TreeMap;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.DriverManager;

import com.eretail.api.eretailapi.controller.BillController;
import com.eretail.api.eretailapi.model.Bill;
import org.springframework.stereotype.Component;
import com.eretail.api.eretailapi.model.miniProd;
import com.eretail.api.eretailapi.persistance.Product.ProductFileDAO;

import org.springframework.beans.factory.annotation.Value;

@Component
public class BillFileDAO implements BillDAO{
    private String database;
    private String datauser;
    private String datapass;
    public static int nextID = 1;
    public static Boolean updated = false;
    private ArrayList<Bill> billArray;
    private ArrayList<Integer> avalibleID= new ArrayList<Integer>();


    public BillFileDAO( @Value("${spring.datasource.url}") String database,
                        @Value("${spring.datasource.username}") String datauser,
                        @Value("${spring.datasource.password}") String datapass
                        ) throws IOException, SQLException{
        this.database=database;
        this.datauser=datauser;
        this.datapass=datapass;
        if(loadBills()){
            BillFileDAO.updated=true;
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private miniProd[] loadCart(int id){
        try {
            ArrayList<miniProd> retHold = new ArrayList<miniProd>();
            String loader = "SELECT * FROM cart WHERE cartid = "+id+" ORDER BY pcode;";
            Connection conn = DriverManager.getConnection(database,datauser,datapass);
            Statement stat = conn.createStatement(); 
            ResultSet load = stat.executeQuery(loader);
            miniProd arrayObj = null;
            while(load.next()){
                arrayObj = new miniProd(load.getInt("cartid"),
                                        load.getString("pcode"),
                                        load.getString("pname"),
                                        load.getInt("price"),
                                        load.getInt("qty"));
                retHold.add(arrayObj);
            }
            int index = -1;
            miniProd[] retVal = new miniProd[retHold.size()];
            for(miniProd i:retHold){
                index++;
                retVal[index] = i;
            }
            load.close();
            stat.close();
            conn.close();
            return retVal;
        } catch (Exception e) {
            System.out.println("ERROR While Loading Cart --> " + e);
        }
        return null;
    }
    private Boolean loadBills(){
        try {
            this.billArray = new ArrayList<Bill>();
            BillController.mpro = new TreeMap<Integer,miniProd[]>();
            BillController.bolo = new TreeMap<Integer,Boolean>();
            String loader = "SELECT * FROM bills ORDER BY bid;";
            Connection conn = DriverManager.getConnection(database,datauser,datapass);
            Statement stat = conn.createStatement(); 
            ResultSet load = stat.executeQuery(loader);
            Bill arrayObj = null;
            while(load.next()){
                arrayObj = new Bill(load.getInt("bid"),
                                    load.getString("name"),
                                    load.getString("mobile"),
                                    new Date(load.getTimestamp("time").getTime()),
                                    load.getDouble("total"),
                                    load.getBoolean("status"),
                                    loadCart(load.getInt("bid")));
                billArray.add(arrayObj);
                BillController.mpro.put(arrayObj.getBid(), arrayObj.getItems());
                BillController.bolo.put(arrayObj.getBid(), arrayObj.isPaid());
            }
            if(arrayObj!=null){BillFileDAO.nextID = arrayObj.getBid()+1;}
            load.close();
            stat.close();
            conn.close();
            return true;
        } catch (Exception e) {
            System.out.println("Eror While Loading Bills --> "+e);
            return false;
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private Boolean saveBills(String command) throws IOException{
        try {
            Connection conn = DriverManager.getConnection(database,datauser,datapass);
            Statement statement =  conn.createStatement();
            int i = statement.executeUpdate(command);
            if(i<1){return false;}
            BillFileDAO.updated = false;
            conn.close();
            statement.close();
            return true;
        } catch (Exception e) {
            System.out.println("\n Error While Saving Bill ->  " + e); 
            return false;
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    @Override
    public Bill[] getBills(int bid) throws IOException, SQLException {
        int index=-1;
        if(!updated){ updated = loadBills(); }
        if(bid!=-1){
            Bill[] retVal =  new Bill[1];
            for(Bill i: this.billArray){
                if(i.getBid()==bid){
                    retVal[0] = i;
                    return retVal;
                }
            }
            return null;
        }
        Bill[] retVal =  new Bill[this.billArray.size()];
        for(Bill i: this.billArray){
            index++;
            retVal[index]=i;
        }
        return retVal;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    String qot(String val){
        String retVal = ", '"+val+"' ";
        return retVal;
    }
    private Boolean createCart(miniProd[] items, int cartid){
        try{
            String cmd = "";
            String cmd2 = "";
            String loader = "";
            ResultSet load = null;
            Boolean retVal = true;
            Connection conn = DriverManager.getConnection(database,datauser,datapass);
            Statement stat = conn.createStatement();
            for(miniProd mpro: items){
                loader = "SELECT * FROM products WHERE pcode = '" + mpro.getPcode() + "';";
                load = stat.executeQuery(loader);
                if(load.next()){
                    cmd = "INSERT INTO cart VALUES("+cartid+ qot(mpro.getPcode()) + qot(mpro.getPname()) + ", " + mpro.getPrice() + ", "  + mpro.getQty() + ");";
                    cmd2 = "UPDATE products SET stock = " + (load.getInt("stock") - mpro.getQty()) + " WHERE pcode = '" +mpro.getPcode()+ "' ;";   
                    retVal = (retVal && saveBills(cmd) && saveBills(cmd2));       
                }
            }
            if(load!=null){load.close();}
            stat.close();
            conn.close();

            if(retVal){ProductFileDAO.updated=false;}
            return retVal;
        }catch(Exception e){
            System.out.println("\nERROR while creating cart -> "+e);
            return false;
        }
    }
    @Override
    public Boolean createBill(String name, String mobile, Date orderDate, double total, boolean status, miniProd[] items){
        try{
            int bid;
            if(this.avalibleID.size()>0){
                bid = avalibleID.get(0);
                this.avalibleID.remove(0);
            }else{       
                BillFileDAO.nextID++;
                bid = (BillFileDAO.nextID - 1); 
            }
            String stat="false";
            if(status){stat = "true";}
            String cmd = "INSERT INTO bills VALUES("+bid + qot(name) +qot(mobile) + qot(orderDate.toString())+","+total+qot(stat)+");";
            if(saveBills(cmd) && createCart(items, bid)){
                return true;
            }
        }catch(Exception e){
            System.out.println("ERROR while creating bill --> " + e);
        }
        return false;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public Boolean deleteBill(int bid) throws IOException {
        String cmd1 = "DELETE FROM bills WHERE bid = " + bid + ";";
        String cmd2 = "DELETE FROM cart WHERE cartid = " + bid + ";";
        if(saveBills(cmd1) && saveBills(cmd2)){
            this.avalibleID.add(bid);
            return true;
        }
        return false;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    String upBill(int bid, String field, String value, int i){
        if(i==1){
            return ("UPDATE bills SET " + field + " = '" + value + "' WHERE bid = " + bid + ";");
        }
        return ("UPDATE bills SET " + field + " = " + value + " WHERE bid = " + bid + ";");
    }
    String stringer(miniProd[] act){    
        String retVal = Integer.toString(act.length);
        for(miniProd i:act){
            retVal = retVal + i.toString();
        }
        System.out.println("ToStringArray = " + retVal);
        return retVal;
    }
    private Boolean updateCart(miniProd[] newitems, int bid){
        try{
            Boolean retVal = true;
            String cmd2 = "DELETE FROM cart WHERE cartid = " + bid + ";";
            if(saveBills(cmd2)){
                retVal = retVal && createCart(newitems, bid);
            }
            return retVal;
        }catch(Exception e){
            System.out.println("ERROR while updating cart --> "+e);
            return false;
        } 
    }
    @Override
    public Boolean updateBill(  int bid, String name, String mobile, Date orderDate, 
                                double total, boolean status, miniProd[] items){
        if(!updated){updated = loadBills();}
        Bill up = null;
        Boolean retVal = true;
        for(Bill i : billArray){
            if(i.getBid() == bid){
                up = i;
                break;
            }
        }
        if(up == null){return null;}
        try {
            if(!up.getName().equals(name)){
                retVal = retVal && saveBills(upBill(bid, "name", name, 1));
            }
            if(!up.getMobile().equals(mobile)){
                retVal = retVal && saveBills(upBill(bid, "mobile", mobile, 1));
            }
            if(!up.getOrderDate().toString().equals(orderDate.toString())){
                retVal = retVal && saveBills(upBill(bid, "time", orderDate.toString(), 1));
            }
            if(! (up.getTotal() == total)){
                retVal = retVal && saveBills(upBill(bid, "total", Double.toString(total), 0));
            }
            if(!up.isPaid().equals(status)){
                retVal = retVal && saveBills(upBill(bid, "status", Boolean.toString(status), 1));
            }
            if(!(stringer(up.getItems()).equals(stringer(items)))){
                retVal = retVal && updateCart(items, bid);
            }
            return retVal;
        }catch (Exception e) {
            System.out.println("\nERROR while updating bills --> "+e);
        }
        return false;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public long formatDate(String indate) {
        try{
            long retVal = Long.parseLong(indate);
            System.out.println("OLD : " + indate + ", NEW : "+ retVal);
            return retVal;
        }catch (Exception e) {
            System.out.println("Error while reformatting date --> " + e);
            return 0;
        }   
    }

    @Override
    public miniProd[] formatItems(String itemArrayString){
        try {
            int index = -1;
            String[] i = new String[5];
            String[] itemsArray = itemArrayString.split(";");
            miniProd[] retVal = new miniProd[itemsArray.length];
            for(String itemString:itemsArray){
                index++;
                i = itemString.split(",");
                retVal[index] = new miniProd(Integer.valueOf(i[0].replace("(" ,"")), i[1], i[2], Double.valueOf(i[3]), Integer.valueOf(i[4].replace(")","")));
            }
            return retVal;
        } catch (Exception e) {
            System.out.println("ERROR while formatting items array -->" + e);
        }
        return null;
    }
}
