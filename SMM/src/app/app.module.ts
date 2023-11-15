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

import { HomeHeaderComponent } from './components/layout/home-header/home-header.component';
import { HomeFooterComponent } from './components/layout/home-footer/home-footer.component';
import { DashboardSidebarComponent } from './components/layout/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout/dashboard-layout.component';
import { LayoutComponent } from './components/layout/layout/layout.component';

import { CardComponent } from './components/miscellaneous/card/card.component';
import { ImgBase64Component } from './components/miscellaneous/img-base64/img-base64.component';
import { MyErrorMessageComponent } from './components/miscellaneous/my-error-message/my-error-message.component';

import { LoginCardComponent } from './components/auth/login-card/login-card.component';
import { RegisterCardComponent } from './components/auth/register-card/register-card.component';

import { UserCardComponent } from './components/user-card/user-card/user-card.component';
import { ClientCardComponent } from './components/user-card/client-card/client-card.component';
import { UserCardHeaderComponent } from './components/user-card/user-card-header/user-card-header.component';

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
    UserCardHeaderComponent,
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
