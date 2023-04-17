import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  selectedCourseId: any;
  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
  ) {
    this.activeRoute.params.subscribe({
      next: (route) => {
        this.selectedCourseId = route['id'];
        this.getCourseDetails();
      },
    });
  }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['/dashboard/courses/all-courses'])
  }
  apiCallActive: boolean = false;
  courseDetails: any;
  getCourseDetails() {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.getCourseDetails.replace(":id", this.selectedCourseId))
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.courseDetails = data.course;
          // this.rootComments = this.courseDetails.rootComments;
          // if (data.statusCode === 200) {
          // this.dataSource = new MatTableDataSource<any>(data.response?.courses || []);
          // this.selectedCourseCategoryDoc = data.response?.category || {};
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


  requestEnrollment() {
    if (this.courseDetails.enrollemtStatus != 'pending') {
      this.apiCallActive = true;
      this.apiService
        .post(apiConstants.requestEnrollment.replace(":id", this.selectedCourseId), {})
        .subscribe({
          next: (data) => {
            this.apiCallActive = false;
            this.getCourseDetails();
          },
          error: (e) => {
            this.apiCallActive = false;
            this.errorHandlingService.handle(e);
          },
        });
    }
  }
  enrollCourse() {
    // 
    this.apiCallActive = true;
    this.apiService
      .post(apiConstants.enrollCourse.replace(":id", this.selectedCourseId), {})
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.router.navigate([Constants.Pages.MY_COURSE_DETAILS.replace(':id', data.enrollment.course)])
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
  }
}
