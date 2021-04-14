//08.02.2021
import { ModuleWithProviders } from '@angular/core';
import {  Routes, RouterModule} from '@angular/router';
//Componentes
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TestComponent } from './components/test/test.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login',component:LoginComponent},
  {path: 'registro', component:RegisterComponent},
  {path: 'test', component:TestComponent},
  {path: 'account', component:AccountComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'gente/:page', component:UsersComponent},
  {path: 'gente', component:UsersComponent},
  {path: 'timeline', component:TimelineComponent},


  {path:'**', component:HomeComponent} //Definir el path del 404
];

export const AppRoutingProviders: any[] =[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
