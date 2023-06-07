package com.eretail.api.eretailapi.controller;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;

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

import com.eretail.api.eretailapi.model.Product;
import com.eretail.api.eretailapi.persistance.Product.ProductDAO;

@RestController
@RequestMapping("products")
public class ProductController {
    private  ProductDAO productDao;
    private static final Logger LOG = Logger.getLogger(ProductController.class.getName());
    public ProductController(ProductDAO productDao){
        this.productDao = productDao;
    }

    @GetMapping("")
    public ResponseEntity<Product[]>getProduct(){
        LOG.info("GET /products ");
        try {
            Product[] retVal = this.productDao.getProducts("null");
            if(retVal!=null){
                return new ResponseEntity<Product[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{pcode}")
    public ResponseEntity<Product[]>getProductPath(@PathVariable String pcode){
        LOG.info("GET /products/" + pcode);
        if(pcode.length()<1){return null;}
        try {
            Product[] retVal = this.productDao.getProducts(pcode);
            if(retVal!=null){
                return new ResponseEntity<Product[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("")
    public ResponseEntity<Boolean> createCompanies(     @RequestParam(name = "pname", required = true) String pname, 
                                                        @RequestParam(name = "category", required = true) String category,
                                                        @RequestParam(name = "company", required = true) String company,
                                                        @RequestParam(name = "stock", required = true) int stock,
                                                        @RequestParam(name = "price", required = true) double price,
                                                        @RequestParam(name = "mnfdate", required = true) String mnfDate,
                                                        @RequestParam(name = "expdate", required = true) String expDate,
                                                        @RequestParam(name = "description", required = true) String description 
                                                ) throws IOException, ParseException{
        LOG.info("POST /companies/" + pname + ":" +description); 
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            Date manufactureDate = new java.sql.Date(sdf.parse(mnfDate).getTime());
            Date expiryDate = new java.sql.Date(sdf.parse(expDate).getTime());
            Boolean productNew = productDao.createProduct(pname,category,company,stock,price,manufactureDate,expiryDate,description);
            if(productNew != null){
                return new ResponseEntity<Boolean>(productNew, HttpStatus.CREATED);
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
    public ResponseEntity<Boolean> updateCategories(@RequestParam(name = "pcode", required = true) String pcode,
                                                    @RequestParam(name = "pname", required = true) String pname, 
                                                    @RequestParam(name = "category", required = true) String category,
                                                    @RequestParam(name = "company", required = true) String company,
                                                    @RequestParam(name = "stock", required = true) int stock,
                                                    @RequestParam(name = "price", required = true) double price,
                                                    @RequestParam(name = "mnfdate", required = true) String mnfDate,
                                                    @RequestParam(name = "expdate", required = true) String expDate,
                                                    @RequestParam(name = "description", required = true) String description 
                                                ) throws IOException, ParseException{ 
        LOG.info("PUT /products/" + pcode + ":" + pname);
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            Date manufactureDate = new java.sql.Date(sdf.parse(mnfDate).getTime());
            Date expiryDate = new java.sql.Date(sdf.parse(expDate).getTime());
            Boolean updated =  productDao.updateProduct(pcode, pname, category, company
            ,stock, price,  manufactureDate, expiryDate, description);
            if(updated==true){
                return new ResponseEntity<Boolean>(updated, HttpStatus.OK);
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
    public ResponseEntity<Boolean> deleteProducts(@RequestParam(name = "pcode"  , required = true) String pcode,
                                                    @RequestParam(name = "pname", required = true) String pname
                                                    ){
        LOG.info("DELETE /products/" + pcode +":"+ pname);
        try{
            boolean deleted = productDao.deleteProduct(pcode,pname);
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
