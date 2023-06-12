package com.eretail.api.eretailapi.persistance.Category;

import java.io.IOException;

import com.eretail.api.eretailapi.model.Category;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryDAO{
    Category[] getCategories(int caid) throws IOException;
    Boolean  deleteCategory(int caid, String caname) throws IOException;
    Category createCategory(String caname, String cadesc) throws IOException;
    Category updateCategory(int id, String newName, String newDesc) throws IOException;
    Boolean categoryNameExists(String caname) throws IOException;
}