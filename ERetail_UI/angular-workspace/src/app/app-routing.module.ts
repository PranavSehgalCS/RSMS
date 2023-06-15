import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { LoginComponent } from './components/Account_Components/login/login.component';
import { SignupComponent } from './components/Account_Components/signup/signup.component';
import { AccPageComponent } from './components/Account_Components/acc-page/acc-page.component';

import { DashboardComponent } from './components/Navigation_Components/dashboard/dashboard.component';

import { ViewcompanyComponent } from './components/Company_Component/viewcompany/viewcompany.component';
import { ViewCompanyComponent } from './components/Company_Component/view-company/view-company.component';
import { EditCompanyComponent } from './components/Company_Component/edit-company/edit-company.component';
import { CreateCompanyComponent } from './components/Company_Component/create-company/create-company.component';

import { ViewcategoryComponent } from './components/Category_Components/viewcategory/viewcategory.component';
import { ViewCategoryComponent } from './components/Category_Components/view-category/view-category.component';
import { EditCategoryComponent } from './components/Category_Components/edit-category/edit-category.component';
import { CreateCategoryComponent } from './components/Category_Components/create-category/create-category.component';

import { ViewproductComponent } from './components/Product_Components/viewproduct/viewproduct.component';
import { ViewProductComponent } from './components/Product_Components/view-product/view-product.component';
import { EditProductComponent } from './components/Product_Components/edit-product/edit-product.component';
import { CreateProductComponent } from './components/Product_Components/create-product/create-product.component';

import { ViewbillComponent } from './components/Bill_Components/viewbill/viewbill.component';
import { ViewBillComponent } from './components/Bill_Components/view-bill/view-bill.component';
import { EditBillComponent } from './components/Bill_Components/edit-bill/edit-bill.component';
import { CreateBillComponent } from './components/Bill_Components/create-bill/create-bill.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'accountpage', component:AccPageComponent},
  
  { path: 'dashboard', component: DashboardComponent},

  { path: 'companies', redirectTo: '/companies/view', pathMatch: 'full' }, 
  { path:'companies/view', component: ViewCompanyComponent,pathMatch: 'prefix'},
  { path:'companies/edit', component: EditCompanyComponent,pathMatch: 'prefix'},
  { path:'companies/create', component: CreateCompanyComponent,pathMatch: 'prefix'},
  { path:'companies/viewcompany', component: ViewcompanyComponent,pathMatch: 'prefix'},
  
  { path: 'categories', redirectTo: '/categories/view', pathMatch: 'full' }, 
  { path: 'categories/view', component: ViewCategoryComponent, pathMatch: 'prefix'},
  { path: 'categories/edit', component: EditCategoryComponent, pathMatch: 'prefix'},
  { path: 'categories/create', component: CreateCategoryComponent, pathMatch: 'prefix'},
  { path: 'categories/viewcategory', component: ViewcategoryComponent, pathMatch: 'prefix'},

  { path: 'products', redirectTo: '/products/view', pathMatch: 'full' }, 
  { path: 'products/view', component: ViewProductComponent, pathMatch: 'prefix'},
  { path: 'products/edit', component: EditProductComponent, pathMatch: 'prefix'},
  { path: 'products/create', component: CreateProductComponent, pathMatch: 'prefix'},
  { path: 'products/viewproduct', component: ViewproductComponent, pathMatch: 'prefix'},

  { path: 'bills', redirectTo: '/bills/view', pathMatch: 'full' }, 
  { path: 'bills/view', component: ViewBillComponent, pathMatch: 'prefix'},
  { path: 'bills/edit', component: EditBillComponent, pathMatch: 'prefix'},
  { path: 'bills/create', component: CreateBillComponent, pathMatch: 'prefix'},
  { path: 'bills/viewbill', component: ViewbillComponent, pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }