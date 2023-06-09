import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './components/Navigation_Components/navbar/navbar.component';
import { DashboardComponent } from './components/Navigation_Components/dashboard/dashboard.component';

import { ViewCategoryComponent } from './components/Category_Components/view-category/view-category.component';
import { EditCategoryComponent } from './components/Category_Components/edit-category/edit-category.component';
import { CreateCategoryComponent } from './components/Category_Components/create-category/create-category.component';

import { ViewCompanyComponent } from './components/Company_Component/view-company/view-company.component';
import { EditCompanyComponent } from './components/Company_Component/edit-company/edit-company.component';
import { CreateCompanyComponent } from './components/Company_Component/create-company/create-company.component';

import { ViewProductComponent } from './components/Product_Components/view-product/view-product.component';
import { EditProductComponent } from './components/Product_Components/edit-product/edit-product.component';
import { CreateProductComponent } from './components/Product_Components/create-product/create-product.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ViewCompanyComponent,
    ViewCategoryComponent,
    CreateCategoryComponent,
    CreateCompanyComponent,
    EditCategoryComponent,
    EditCompanyComponent,
    ViewProductComponent,
    EditProductComponent,
    CreateProductComponent
    ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { 
}
