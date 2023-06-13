package com.eretail.api.eretailapi.controller;

import java.sql.Date;
import java.sql.SQLException;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eretail.api.eretailapi.model.Bill;
import com.eretail.api.eretailapi.model.miniProd;
import com.eretail.api.eretailapi.persistance.Bill.BillDAO;
import com.eretail.api.eretailapi.persistance.Bill.BillFileDAO;

@RestController
@RequestMapping("bills")
public class BillController {
    private BillDAO billDao;
    private static final Logger LOG = Logger.getLogger(BillController.class.getName());
    
    public BillController(BillDAO billDao){
        this.billDao = billDao;
    }

    @GetMapping("")
    public ResponseEntity<Bill[]>getAllBills(){
        LOG.info("GET /bills ");
        try {
            Bill[] retVal = this.billDao.getBills(-1);
            if(retVal!=null){
                return new ResponseEntity<Bill[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{bid}")
    public ResponseEntity<Bill[]>getBill(@PathVariable int bid){
        LOG.info("GET /bills/" + bid);
        try {
            Bill[] retVal = this.billDao.getBills(bid);
            if(retVal!=null){
                return new ResponseEntity<Bill[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/currentid")
    public ResponseEntity<Integer>getBillID(){
        LOG.info("GET /products/currentid");
        try {
            int retVal = BillFileDAO.nextID;
            return new ResponseEntity<Integer>( retVal,HttpStatus.OK);
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ',' --> 'ྠ' (4000)
    // ';' --> 'ྡ' (4001)
    // 'd' --> 'Y,M,D'
    @PostMapping("")
    public ResponseEntity<Boolean> createNewBill(   @RequestParam(required = true, name = "name"  ) String name, 
                                                    @RequestParam(required = true, name = "mobile") String mobile,
                                                    @RequestParam(required = true, name = "date"  ) String date,
                                                    @RequestParam(required = true, name = "total" ) double total,
                                                    @RequestParam(required = true, name = "paid"  ) boolean status,
                                                    @RequestParam(required = true, name = "items" ) String itemString
                                                ) throws IOException, ParseException, SQLException{
        LOG.info("POST /bills/"+name + ":" + date); 
        try{
            System.out.println("\n\nITEMS : " + itemString + "\n\n");
            miniProd[] formattedItems = this.billDao.formatItems(itemString);
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            Date orderDate = new java.sql.Date(sdf.parse(billDao.formatDate(date)).getTime());
            Boolean newBill = billDao.createBill(name, mobile, orderDate,total, status, formattedItems);
            if(newBill != null && newBill!=false){
                return new ResponseEntity<Boolean>(newBill, HttpStatus.CREATED);
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
    public ResponseEntity<Boolean> updateBill(  @RequestParam(required = true, name = "bid"   ) int bid,
                                                @RequestParam(required = true, name = "name"  ) String name, 
                                                @RequestParam(required = true, name = "mobile") String mobile,
                                                @RequestParam(required = true, name = "date"  ) String date,
                                                @RequestParam(required = true, name = "total" ) double total,
                                                @RequestParam(required = true, name = "paid"  ) boolean status,
                                                @RequestParam(required = true, name = "items" ) String itemString
                                                ) throws IOException, ParseException, SQLException{
        LOG.info("PUT /bills/"+name + ":" + date); 
        try{
            System.out.println("\n\nITEMS : " + itemString + "\n\n");
            miniProd[] formattedItems = this.billDao.formatItems(itemString);
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            Date orderDate = new java.sql.Date(sdf.parse(billDao.formatDate(date)).getTime());
            Boolean newBill = billDao.updateBill(bid,name, mobile, orderDate,total, status, formattedItems);
            if(newBill != null && newBill!=false){
                return new ResponseEntity<Boolean>(newBill, HttpStatus.CREATED);
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


    @DeleteMapping("/{bid}")
    public ResponseEntity<Boolean> deleteBills(@PathVariable int bid ){
        LOG.info("DELETE /bill/" + bid);
        try{
            boolean deleted = billDao.deleteBill(bid);
            if(deleted){
                return new ResponseEntity<Boolean>(deleted,HttpStatus.OK);
            }
            else{
                return new ResponseEntity<Boolean>(deleted,HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
