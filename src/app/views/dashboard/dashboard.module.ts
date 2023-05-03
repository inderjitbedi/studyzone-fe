import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from 'src/app/providers/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes = [
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings', component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'courses' },
];

@NgModule({
  declarations: [DashboardComponent, HeaderComponent,SettingsComponent],
  imports: [RouterModule,
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule],
})
export class DashboardModule { }
