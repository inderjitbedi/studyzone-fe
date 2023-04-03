import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseDetailComponent } from './views/course-detail/course-detail.component';
import { MyCoursesComponent } from './views/my-courses/my-courses.component';
import { MyCoursesDetailsComponent } from './views/my-courses-details/my-courses-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseDetailComponent,
    MyCoursesComponent,
    MyCoursesDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
