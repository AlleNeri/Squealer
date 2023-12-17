import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

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
import { MyErrorMessageComponent } from './components/miscellaneous/my-error-message/my-error-message.component';

import { LoginCardComponent } from './components/auth/login-card/login-card.component';
import { RegisterCardComponent } from './components/auth/register-card/register-card.component';

import { UserCardComponent } from './components/user-card/user-card/user-card.component';
import { ClientCardComponent } from './components/user-card/client-card/client-card.component';

import { UserInformationService, factoryUserInformationService } from './services/user-information.service';

import { ScreenDimensionDirective } from './directives/screen-dimension.directive';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { it_IT } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';

registerLocaleData(it);

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzDividerModule,
    NzTypographyModule,
    NzBreadCrumbModule,
    NzImageModule,
    NzCardModule,
    NzAvatarModule,
    NzSkeletonModule,
  ],
  providers: [
    UserInformationService,
    {
      provide: APP_INITIALIZER,
      useFactory: factoryUserInformationService,
      deps: [UserInformationService],
      multi: true
    },
    { provide: NZ_I18N, useValue: it_IT }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
