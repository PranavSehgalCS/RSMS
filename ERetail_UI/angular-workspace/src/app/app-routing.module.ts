import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { LoginComponent } from './components/Account_Components/login/login.component';
import { SignupComponent } from './components/Account_Components/signup/signup.component';
import { AccPageComponent } from './components/Account_Components/acc-page/acc-page.component';

import { DashboardComponent } from './components/Navigation_Components/dashboard/dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'accountpage', component:AccPageComponent},
  
  { path: 'dashboard', component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }