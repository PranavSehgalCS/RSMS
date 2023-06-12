package com.eretail.api.eretailapi.controller;

import java.io.IOException;
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

import com.eretail.api.eretailapi.model.Category;
import com.eretail.api.eretailapi.persistance.Category.CategoryDAO;


@RestController
@RequestMapping("categories")
public class CategoryController{
    private  CategoryDAO categoryDao;
    private static final Logger LOG = Logger.getLogger(CategoryController.class.getName());
    
    public CategoryController(CategoryDAO categoryDao) {
        this.categoryDao = categoryDao;
    }
    @GetMapping("")
    public ResponseEntity<Category[]>getCategory(){
        LOG.info("GET /categories/");
        try {
            Category[] retVal = this.categoryDao.getCategories(-1);
            if(retVal!=null){
                return new ResponseEntity<Category[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{caid}")
    public ResponseEntity<Category[]>getCategoryPath(@PathVariable Integer caid){
        LOG.info("GET /categories/" + caid);
        if(caid<0){return null;}
        try {
            Category[] retVal = this.categoryDao.getCategories(caid);
            if(retVal!=null){
                return new ResponseEntity<Category[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/exists/{caname}")
    public ResponseEntity<Boolean>productExistance(@PathVariable String caname){

        LOG.info("GET companies/exists/" + caname);
        if(caname.length()<1){return null;}
        try {
            Boolean retVal  = this.categoryDao.categoryNameExists(caname);
            if(retVal!=null ){
                return new ResponseEntity<Boolean>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("")
    public ResponseEntity<Category> createCategories(   @RequestParam(name = "caname", required = true) String caname, 
                                                        @RequestParam(name = "cadesc", required = true) String cadesc
                                                ) throws IOException{
        LOG.info("POST /categories/" + caname + ":" +cadesc);
        try{
            Category categoryNew = categoryDao.createCategory(caname,cadesc);
            if(categoryNew != null){
                return new ResponseEntity<Category>(categoryNew, HttpStatus.CREATED);
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
    public ResponseEntity<Category> updateCategories(   @RequestParam(name = "caid", required = true) Integer coid, 
                                                        @RequestParam(name = "caname" , required = true) String coname,
                                                        @RequestParam(name = "cadesc" , required = true) String codesc
                                                ){
        LOG.info("PUT /categories/" + coname + "/");
        try{
            Category update =  categoryDao.updateCategory(coid,coname,codesc);
            if(update != null){
                return new ResponseEntity<Category>(update, HttpStatus.OK);
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
    public ResponseEntity<Boolean> deleteCategories(@RequestParam(name = "caid"  , required = true) Integer caid,
                                                    @RequestParam(name = "caname", required = true) String  caname
                                                    ){
        LOG.info("DELETE /category/" + caid +":"+ caname);
        try{
            boolean deleted = categoryDao.deleteCategory(caid,caname);
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
