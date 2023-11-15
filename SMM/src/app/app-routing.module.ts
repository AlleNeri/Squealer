import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout/layout.component';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout/dashboard-layout.component';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { GeneralComponent } from './pages/general/general.component';
import { ClientComponent } from './pages/client/client.component';

const routes: Routes = [
  { path: 'smm', redirectTo: '/smm/general', pathMatch: 'full' }, // to make unreachable "smm" path
  {
    path: 'smm',
    component: DashboardLayoutComponent,
    children: [
      { path: 'general', component: GeneralComponent },
      { path: 'clients/:id', component: ClientComponent },
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // to make unreachable empty path
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, // to redirect unfind path to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
