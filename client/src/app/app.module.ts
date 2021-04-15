import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { routing, AppRoutingProviders } from './app-routing.module';
import * as $ from 'jquery';  //Para poder usar jquery
import {MomentModule} from 'angular2-moment';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent} from './components/sidebar/sidebar.component';
import { TimelineComponent} from './components/timeline/timeline.component';
import { PublicationsComponent} from './components/publications/publications.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TestComponent,
    AccountComponent,
    ProfileComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    routing
  ],
  providers: [
    AppRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
