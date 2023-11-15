import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { GeneralComponent } from './pages/general/general.component';
import { ClientComponent } from './pages/client/client.component';

import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { HomeFooterComponent } from './components/home-footer/home-footer.component';
import { CardComponent } from './components/card/card.component';
import { LoginCardComponent } from './components/login-card/login-card.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { RegisterCardComponent } from './components/register-card/register-card.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { MyErrorMessageComponent } from './components/my-error-message/my-error-message.component';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { ImgBase64Component } from './components/img-base64/img-base64.component';

import { UserInformationService, factoryUserInformationService } from './services/user-information.service';

import { ScreenDimensionDirective } from './directives/screen-dimension.directive';

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
    ClientComponent,
    UserCardComponent,
    ScreenDimensionDirective,
    MyErrorMessageComponent,
    ClientCardComponent,
    ImgBase64Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    UserInformationService,
    {
      provide: APP_INITIALIZER,
      useFactory: factoryUserInformationService,
      deps: [UserInformationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
