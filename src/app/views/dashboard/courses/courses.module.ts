import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { RouterModule } from '@angular/router';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { MyCoursesDetailsComponent } from './my-courses-details/my-courses-details.component';


const routes = [
  { path: 'all-courses', component: AllCoursesComponent },
  { path: 'course/details', component: CourseDetailComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: 'my-course/details', component: MyCoursesDetailsComponent },
  { path: '**', redirectTo: 'all-courses' },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CoursesModule { }
