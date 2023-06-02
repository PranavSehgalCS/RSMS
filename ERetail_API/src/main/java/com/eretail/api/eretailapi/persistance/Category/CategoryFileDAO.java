package com.eretail.api.eretailapi.persistance.Category;

import java.util.ArrayList;
import java.sql.ResultSet;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.DriverManager;

import org.springframework.stereotype.Component;
import com.eretail.api.eretailapi.model.Category;
import org.springframework.beans.factory.annotation.Value;

@Component
public class CategoryFileDAO implements CategoryDAO{
    private String database;
    private String datauser;
    private String datapass;
    private static int nextID;
    private Boolean updated = false;
    private ArrayList<Category> categoryArray;
    private ArrayList<Integer> avalibleID= new ArrayList<Integer>(); 

    public CategoryFileDAO( @Value("${spring.datasource.url}") String database,
                            @Value("${spring.datasource.username}") String datauser,
                            @Value("${spring.datasource.password}") String datapass
                            ) throws IOException, SQLException {
        this.database=database;
        this.datauser=datauser;
        this.datapass=datapass;
        this.updated = loadCategories();

    }


    private Boolean loadCategories() throws IOException{
        try {
            this.categoryArray = new ArrayList<Category>();
            Category arrayObj = new Category(0,null, null);
            String loader = "SELECT * FROM categories ORDER BY caid";
            ResultSet load = DriverManager.getConnection(database,datauser,datapass).createStatement().executeQuery(loader);
            while(load.next()){
                arrayObj = new Category(load.getInt("caid"),
                                        load.getString("caname"),
                                        load.getString("cadesc"));
                categoryArray.add(arrayObj);
            }
            CategoryFileDAO.nextID = (arrayObj.getCaid()+1);
            return true;
        }catch (Exception e) {
            System.out.println("\n Error While Loading Categories->  "+e);
        }
        return false;
    }
    private Boolean saveCategories(String command) throws IOException{
        try {
            Statement statement =  DriverManager.getConnection(database,datauser,datapass).createStatement();
            int i = statement.executeUpdate(command);
            statement.close();
            if(i<1){return false;}
            this.updated=false;
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Category[] getCategories(int caid) throws IOException{
        if(!updated){ 
            updated = loadCategories();
        }
        if(caid != -1){
            Category[] retVal =  new Category[1];
            for(Category i: this.categoryArray){
                if(i.getCaid()==caid){
                    retVal[0]=i;
                    return retVal;
                }
            } 
            return null;
        }

        int index=-1;
        Category[] retVal =  new Category[this.categoryArray.size()];
        for(Category i: this.categoryArray){
            index++;
            retVal[index]=i;
        }
        return retVal;
    }

    @Override
    public Boolean deleteCategory(int caid, String caname) throws IOException {
        String cmd = "DELETE FROM categories WHERE caid = " + caid + " AND caname = '"+caname+"';";
        if(saveCategories(cmd)){
            updated=false;
            this.avalibleID.add(caid);
            return true;
        }
        return false;
    }

    @Override
    public Category createCategory(String caname, String cadesc) throws IOException {
        int caid = 0;
        if(this.avalibleID.size()>0){
            caid = avalibleID.get(0);
            this.avalibleID.remove(0);
        }else{       
            CategoryFileDAO.nextID++;
            caid = CategoryFileDAO.nextID-1;
        } 
        String cmd = "INSERT INTO categories VALUES("+caid + ", '"+caname+"', '"+cadesc+"');";
        if(saveCategories(cmd)){
            updated=false;
            return new Category(caid, caname, cadesc);
        }else{
            return null;
        }
    }

    @Override
    public Category updateCategory(int caid, String newName, String newDesc) throws IOException {
        Boolean b1 = true;
        Boolean b2 = true;
        Category retVal = null;
        for(Category i: this.categoryArray){
            if(i.getCaid()==caid){
                retVal =i;
                break;
            }
        }
        if(retVal!=null){
            if(!retVal.getCaname().equals(newName)){
                updated=false;
                b1 = saveCategories("UPDATE categories SET caname = '" + newName +"' WHERE caid = " + caid +";");
            }
            if(!retVal.getCadesc().equals(newDesc)){
                updated=false;
                b2 = saveCategories("UPDATE categories SET cadesc = '" + newDesc +"' WHERE caid = " + caid +";");
            }
            if(b1 && b2){
                return new Category(caid, newName, newDesc);
            }
        }
        return null;
    }
    
}
