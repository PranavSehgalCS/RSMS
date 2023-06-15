package com.eretail.api.eretailapi.persistance.Company;

import java.sql.Statement;
import java.sql.ResultSet;
import java.io.IOException;
import java.util.ArrayList;
import java.sql.SQLException;
import java.sql.Connection;
import java.sql.DriverManager;

import org.springframework.stereotype.Component;
import com.eretail.api.eretailapi.model.Company;
import com.eretail.api.eretailapi.persistance.Product.ProductFileDAO;

import org.springframework.beans.factory.annotation.Value;

@Component
public class CompanyFileDAO implements CompanyDAO{
    private String database;
    private String datauser;
    private String datapass;
    private static int nextID;
    private Boolean updated = false;
    private ArrayList<Company> companyArray;
    private ArrayList<Integer> avalibleID= new ArrayList<Integer>(); 

    public CompanyFileDAO(  @Value("${spring.datasource.url}") String database,
                            @Value("${spring.datasource.username}") String datauser,
                            @Value("${spring.datasource.password}") String datapass
                            ) throws IOException, SQLException {
        this.database=database;
        this.datauser=datauser;
        this.datapass=datapass;
        if(loadCompanies()){
            this.updated=true;
        }
    }
    
    private Boolean loadCompanies() throws IOException{
        try {
            this.companyArray = new ArrayList<Company>();
            String loader = "SELECT * FROM companies ORDER BY coid";
            Company arrayObj = new Company(0,null, null);
            Connection conn = DriverManager.getConnection(database,datauser,datapass);
            Statement stat = conn.createStatement(); 
            ResultSet load = stat.executeQuery(loader);
            while(load.next()){
                arrayObj= new Company(load.getInt("coid"),
                                            load.getString("coname"),
                                            load.getString("codesc"));
                companyArray.add(arrayObj);
            }
            CompanyFileDAO.nextID = (arrayObj.getCoid()+1);
            load.close();
            stat.close();
            conn.close();
            return true;
        }catch (Exception e) {
            System.out.println("\n Error While Loading  Companies->  "+e);
        }
        return false;
    }   

    private Boolean saveCompanies(String command) throws IOException{
        try {
            Statement statement =  DriverManager.getConnection(database,datauser,datapass).createStatement();
            int i = statement.executeUpdate(command);
            statement.close();
            if(i<1){return false;}
            this.updated = false;
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public Company[] getCompanies(int coid) throws IOException{
        int index=-1;
        if(!updated){ 
            updated = loadCompanies();
        }
        if(coid != -1){
            Company[] retVal =  new Company[1];
            for(Company i: this.companyArray){
                if(i.getCoid()==coid){
                    retVal[0]=i;
                    return retVal;
                }
            }
            return null;
        }
        Company[] retVal =  new Company[this.companyArray.size()];
        for(Company i: this.companyArray){
            index++;
            retVal[index]=i;
        }
        return retVal;
    }

    @Override
    public Boolean deleteCompany(int coid, String coname) throws IOException {
        String cmd = "DELETE FROM companies WHERE coid = " + coid + " AND coname = '"+coname+"';";
        if(saveCompanies(cmd)){
            this.avalibleID.add(coid);
            saveCompanies("UPDATE products SET company = '?' WHERE company = '"+coname+"';");
            ProductFileDAO.updated = false;
            return true;
        }
        return false;
    }

    @Override
    public Company createCompany(String coname, String codesc) throws IOException{
        int coid = 0;
        if(this.avalibleID.size()>0){
            coid = avalibleID.get(0);
            this.avalibleID.remove(0);
        }else{       
            CompanyFileDAO.nextID++;
            coid = CompanyFileDAO.nextID-1;
        }
        String cmd = "INSERT INTO companies VALUES("+coid + ", '"+coname+"', '"+codesc+"');";
        if(saveCompanies(cmd)){
            return new Company(coid, coname, codesc);
        }else{
            return null;
        }
    }

    @Override
    public Company updateCompany(int coid, String newName, String newDesc) throws IOException, SQLException {
        if(!updated){loadCompanies();}
        Boolean b1 = true;
        Boolean b2 = true;
        Company retVal = null;
        for(Company i: this.companyArray){
            if(i.getCoid()==coid){
                retVal =i;
                break;
            }
        }
        if(retVal!=null){
            if(!retVal.getConame().equals(newName)){
                b1 = saveCompanies("UPDATE companies SET coname = '" + newName +"' WHERE coid = " + coid +";");
                String loader = ("SELECT * FROM companies WHERE coid = " + coid + ";");
                ResultSet load = DriverManager.getConnection(database,datauser,datapass).createStatement().executeQuery(loader);
                String oldName = load.getString("coname");
                saveCompanies("UPDATE products SET company = '" + newName +"' WHERE company = '" + oldName +"';"); 
                ProductFileDAO.updated = false;
            }
            if(!retVal.getCodesc().equals(newDesc)){
                b2 = saveCompanies("UPDATE companies SET codesc = '" + newDesc +"' WHERE coid = " + coid +";");
            }
            if(b1 && b2){
                return new Company(coid, newName, newDesc);
            }
        }
        return null;
    }

    @Override
    public Boolean companyNameExists(String coname) throws IOException{
        if(!updated){updated = loadCompanies();}
        for(Company i: companyArray){
            if(i.getConame().equals(coname)){
                return true;
            }
        }
        return false;
    }
}
