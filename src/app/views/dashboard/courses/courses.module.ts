import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { RouterModule } from '@angular/router';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { MyCoursesDetailsComponent } from './my-courses-details/my-courses-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentComponent } from './payment/payment.component';

const routes = [
  { path: 'all', component: AllCoursesComponent },
  { path: 'course/:id/details', component: CourseDetailComponent },
  { path: 'course/:id/payment', component: PaymentComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: 'my-course/:id/details', component: MyCoursesDetailsComponent },
  {
    path: 'my-course/:id/slide/:slideid',
    component: MyCoursesDetailsComponent,
  },
  { path: '**', redirectTo: 'all' },
];

@NgModule({
  declarations: [
    AllCoursesComponent,
    CourseDetailComponent,
    MyCoursesComponent,
    MyCoursesDetailsComponent,
    PaymentComponent,
  ],
  imports: [
    RouterModule,
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(
      'pk_test_51OCYMFI5NMkvPoS4GxMzmtIScxs9JnIIkNX1J9eGkHXZV8R6ljWB8d2v7NRReZcXI0KP7XRY1RtQqGqMsb7SPIjc00DEI3AoeA'
    ),
    FormsModule,
    PdfViewerModule,
  ],
})
export class CoursesModule {}
