import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { RouterModule } from '@angular/router';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { MyCoursesDetailsComponent } from './my-courses-details/my-courses-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes = [
  { path: 'all', component: AllCoursesComponent },
  { path: 'course/:id/details', component: CourseDetailComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: 'my-course/:id/details', component: MyCoursesDetailsComponent },
  { path: 'my-course/:id/slide/:slideid', component: MyCoursesDetailsComponent },
  { path: '**', redirectTo: 'all' },
];

@NgModule({
  declarations: [
    AllCoursesComponent,
    CourseDetailComponent,
    MyCoursesComponent,
    MyCoursesDetailsComponent,
  ],
  imports: [RouterModule, RouterModule.forChild(routes), CommonModule,
    ReactiveFormsModule,
    FormsModule,],
})
export class CoursesModule { }
