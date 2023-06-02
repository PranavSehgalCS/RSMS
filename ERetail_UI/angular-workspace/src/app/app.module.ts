import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//import { LoginComponent } from './components/Account_Components/login/login.component';
//import { SignupComponent } from './components/Account_Components/signup/signup.component';
//import { AccPageComponent } from './components/Account_Components/acc-page/acc-page.component';


import { NavbarComponent } from './components/Navigation_Components/navbar/navbar.component';
import { DashboardComponent } from './components/Navigation_Components/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent
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
