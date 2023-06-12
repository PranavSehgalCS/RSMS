package com.eretail.api.eretailapi.persistance.Company;

import java.io.IOException;
import org.springframework.stereotype.Repository;
import com.eretail.api.eretailapi.model.Company;


@Repository
public interface CompanyDAO{
    Company[] getCompanies(int coid) throws IOException;
    Boolean deleteCompany(int coid, String coname) throws IOException;
    Company createCompany(String coname, String codesc) throws IOException;
    Company updateCompany(int id, String newName, String newDesc) throws IOException;
    Boolean companyNameExists(String caname) throws IOException;
}