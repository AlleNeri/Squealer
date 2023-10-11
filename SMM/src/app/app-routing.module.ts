import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeHeaderComponent } from './components/home-header/home-header.component';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // to make unreachable empty path
  {
    path: '',
    component: HomeHeaderComponent,
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
