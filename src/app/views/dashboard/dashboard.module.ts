import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';


const routes = [
  { path: 'courses', loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule), },
  { path: 'setting', component: SettingsComponent },
  { path: '**', redirectTo: 'courses' },
];


@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent
  ],
  imports: [
    RouterModule,
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class DashboardModule { }
