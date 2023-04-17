import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  constructor(
    private router: Router,
    private apiService: CommonAPIService, private formBuilder: FormBuilder,

    private errorHandlingService: ErrorHandlingService
  ) {
    this.getCourses();
    this.searchForm = this.formBuilder.group({
      type: [''],
      searchKey: [''],
    });
    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value: any) => {
        this.courses = []
        this.pagination = {
          page: 1,
          limit: 6,
        }
        this.getCourses();
      }
    })
  }  apiCallActive: boolean = false;
  courses: any = [];
  totalCourses: number = 0;
  pagination: any = {
    page: 1,
    limit: 6,
  };
  searchForm: FormGroup;
  toQueryString(obj: any) {
    let queryStr = '';
    Object.keys(obj).map((key: any, index: number) => {
      if (obj[key]) {
        index === 0 ? (queryStr += '?') : (queryStr += '&');

        queryStr += key + '=' + obj[key];
      }
    });
    return queryStr;
  }
  ngOnInit(): void {
  }
  viewDetails(enrollment:any){
    this.router.navigate([Constants.Pages.MY_COURSE_DETAILS.replace(':id', enrollment.course._id)])
  }
  
  getCourses() {
    this.apiCallActive = true;
    let { page, limit } = this.pagination;

    this.apiService
      .get(apiConstants.myCourses + this.toQueryString({ page, limit, ...this.searchForm?.value }))
      .subscribe({
        next: ({ courses, pagination, totalCourses }) => {
          this.apiCallActive = false;
          // if (data.statusCode === 200) {
          this.courses = [...this.courses, ...courses];
          console.log( this.courses );
          
          this.pagination.page++;
          this.pagination = { ...this.pagination, ...pagination }
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
