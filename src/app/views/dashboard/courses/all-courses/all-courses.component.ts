import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss'],
})
export class AllCoursesComponent implements OnInit {
  constructor(
    private router: Router,
    private apiService: CommonAPIService,

    private errorHandlingService: ErrorHandlingService
  ) {
    this.getCourses();
  }

  ngOnInit(): void {}
  viewDetails() {
    this.router.navigate(['/dashboard/courses/course/details']);
  }
  apiCallActive: boolean = false;
  courses: any = [];
  totalCourses: number = 0;
  pagination: any = {
    page: 1,
    limit: 6,
  };
  toQueryString(obj: any) {
    let queryStr = '';
    Object.keys(obj).map((key: any, index: number) => {
      index === 0 ? (queryStr += '?') : (queryStr += '&');
      queryStr += key + '=' + obj[key];
    });
    return queryStr;
  }

  getCourses() {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.allCourses + this.toQueryString(this.pagination))
      .subscribe({
        next: ({ courses, pagination, totalCourses }) => {
          this.apiCallActive = false;
          // if (data.statusCode === 200) {
          this.courses = courses;
          this.pagination.page++;
          console.log(this.pagination);
          this.totalCourses = totalCourses;
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
  }
}
