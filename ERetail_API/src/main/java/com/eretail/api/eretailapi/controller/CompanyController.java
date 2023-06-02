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

import com.eretail.api.eretailapi.model.Company;
import com.eretail.api.eretailapi.persistance.Company.CompanyDAO;

@RestController
@RequestMapping("companies")
public class CompanyController {
    private  CompanyDAO companyDao;
    private static final Logger LOG = Logger.getLogger(CompanyController.class.getName());
    
    public CompanyController(CompanyDAO companyDao) {
        this.companyDao = companyDao;
    }

    @GetMapping("")
    public ResponseEntity<Company[]>getCompany(){
        LOG.info("GET /companies/");
        try {
            Company[] retVal = this.companyDao.getCompanies(-1);
            if(retVal!=null){
                return new ResponseEntity<Company[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{coid}")
    public ResponseEntity<Company[]>getCompanyPath(@PathVariable Integer coid){
        LOG.info("GET /companies/" + coid);
        if(coid<1){return null;}
        try {
            Company[] retVal = this.companyDao.getCompanies(coid);
            if(retVal!=null){
                return new ResponseEntity<Company[]>(retVal ,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE,e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("")
    public ResponseEntity<Company> updateCompanies( @RequestParam(name = "coid", required = true) Integer coid, 
                                                    @RequestParam(name = "coname" , required = true) String coname,
                                                    @RequestParam(name = "codesc" , required = true) String codesc
                                                ){
        LOG.info("PUT /companies /" + coname + "/");
        try{
            Company update =  companyDao.updateCompany(coid,coname,codesc);
            if(update != null){
                return new ResponseEntity<Company>(update, HttpStatus.OK);
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

    @PostMapping("")
    public ResponseEntity<Company> createCompanies(     @RequestParam(name = "coname", required = true) String coname, 
                                                        @RequestParam(name = "codesc", required = true) String codesc
                                                ) throws IOException{
        LOG.info("POST /companies/" + coname + ":" +codesc);
        try{
            Company companyNew = companyDao.createCompany(coname,codesc);
            if(companyNew != null){
                return new ResponseEntity<Company>(companyNew, HttpStatus.CREATED);
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

    @DeleteMapping("")
    public ResponseEntity<Boolean> deleteCategories(@RequestParam(name = "coid"  , required = true) Integer coid,
                                                    @RequestParam(name = "coname", required = true) String  coname
                                                    ){
        LOG.info("DELETE /category/" + coid +":"+ coname);
        try{
            boolean deleted = companyDao.deleteCompany(coid,coname);
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
