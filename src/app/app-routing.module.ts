import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

import { userSession } from './shared/guard/userSession.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', loadChildren: ()  => import('./components/dashboard/dashboard.module').then(x => x.DashboardModule), canActivate : [userSession]},
  //{path: 'uploader', component: UploaderComponent, canActivate : [userSession]},
  {path: '**', redirectTo: 'login', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
