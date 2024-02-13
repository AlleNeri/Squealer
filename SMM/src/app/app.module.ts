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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMentionModule } from 'ng-zorro-antd/mention';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  InboxOutline,
  UserOutline,
  EyeOutline,
  LikeOutline,
  DislikeOutline,
  ExclamationCircleOutline,
  HeartOutline,
  ClockCircleOutline,
  SettingOutline,
  DeleteTwoTone,
} from '@ant-design/icons-angular/icons';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { GeneralComponent } from './pages/general/general.component';
import { ClientComponent } from './pages/client/client.component';

import { HomeHeaderComponent } from './components/layout/home-header/home-header.component';
import { DashboardSidebarComponent } from './components/layout/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout/dashboard-layout.component';
import { LayoutComponent } from './components/layout/layout/layout.component';

import { CardComponent } from './components/miscellaneous/card/card.component';
import { MyErrorMessageComponent } from './components/miscellaneous/my-error-message/my-error-message.component';
import { BuyCharFormComponent } from './components/miscellaneous/buy-char-form/buy-char-form.component';

import { LoginCardComponent } from './components/auth/login-card/login-card.component';
import { RegisterCardComponent } from './components/auth/register-card/register-card.component';

import { PostAsClientComponent } from './components/posts/post-as-client/post-as-client.component';

import { UserCardComponent } from './components/user-card/user-card/user-card.component';
import { ClientCardComponent } from './components/user-card/client-card/client-card.component';

import { UserInformationService, factoryUserInformationService } from './services/user-information.service';
import { ScreenDimensionDirective } from './directives/screen-dimension.directive';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { it_IT } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
import { PostSectionComponent } from './components/posts/post-section/post-section.component';
import { UploadImageComponent } from './components/miscellaneous/upload-image/upload-image.component';
import { MapComponent } from './components/miscellaneous/map/map.component';
import { PostComponent } from './components/posts/post/post.component';
import { ShowMapComponent } from './components/miscellaneous/show-map/show-map.component';
import { UserSettingsComponent } from './components/auth/user-settings/user-settings.component';
import { UserEditComponent } from './components/auth/user-edit/user-edit.component';
import { UserDeleteComponent } from './components/auth/user-delete/user-delete.component';

registerLocaleData(it);

const icons: IconDefinition[]= [
  InboxOutline,
  UserOutline,
  EyeOutline,
  LikeOutline,
  DislikeOutline,
  ExclamationCircleOutline,
  HeartOutline,
  ClockCircleOutline,
  SettingOutline,
  DeleteTwoTone,
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HomeHeaderComponent,
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
    BuyCharFormComponent,
    PostAsClientComponent,
    PostSectionComponent,
    UploadImageComponent,
    MapComponent,
    PostComponent,
    ShowMapComponent,
    UserSettingsComponent,
    UserEditComponent,
    UserDeleteComponent,
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
    NzModalModule,
    NzButtonModule,
    NzInputNumberModule,
    NzSelectModule,
    NzPopoverModule,
    NzTabsModule,
    NzGridModule,
    NzDrawerModule,
    NzSpaceModule,
    NzStatisticModule,
    NzUploadModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    NzCommentModule,
    NzToolTipModule,
    NzTagModule,
    NzMentionModule,
    NzIconModule.forChild(icons),
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
