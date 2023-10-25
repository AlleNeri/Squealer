import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';

import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { HomeFooterComponent } from './components/home-footer/home-footer.component';
import { CardComponent } from './components/card/card.component';
import { LoginCardComponent } from './components/login-card/login-card.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { GeneralComponent } from './pages/general/general.component';
import { RegisterCardComponent } from './components/register-card/register-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    CardComponent,
    LoginCardComponent,
    LayoutComponent,
    DashboardLayoutComponent,
    DashboardSidebarComponent,
    GeneralComponent,
    RegisterCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
