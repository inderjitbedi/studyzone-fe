import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { RouterModule } from '@angular/router';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { MyCoursesDetailsComponent } from './my-courses-details/my-courses-details.component';

const routes = [
  { path: 'all', component: AllCoursesComponent },
  { path: ':id/details', component: CourseDetailComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: 'my-course/:id/details', component: MyCoursesDetailsComponent },
  { path: '**', redirectTo: 'all' },
];

@NgModule({
  declarations: [
    AllCoursesComponent,
    CourseDetailComponent,
    MyCoursesComponent,
    MyCoursesDetailsComponent,
  ],
  imports: [RouterModule, RouterModule.forChild(routes), CommonModule],
})
export class CoursesModule {}
