import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
    // canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'auth'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
