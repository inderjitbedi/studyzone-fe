import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-courses-details',
  templateUrl: './my-courses-details.component.html',
  styleUrls: ['./my-courses-details.component.scss']
})
export class MyCoursesDetailsComponent implements OnInit {
  baseUrl: any = environment.baseUrl;

  selectedCourseId: any;
  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService, private _location: Location
  ) {
    this.activeRoute.params.subscribe({
      next: (route) => {
        this.selectedCourseId = route['id'];
        this.getCourseDetails();
      },
    });
  }

  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['/dashboard/courses/my-courses'])
  }

  apiCallActive: boolean = false;
  courseDetails: any;
  slides: any = [];
  getCourseDetails() {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.getMyCourseDetails.replace(":id", this.selectedCourseId))
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.courseDetails = data.courseDetails;
          this.getProgress()
          this.slides = data.slides;

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
  slideDetails: any = {};
  selectedSlideId: any;
  getSlideDetails(slide: any) {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.getSlideDetails.replace(":id", this.selectedCourseId).replace(':slideid', slide._id))
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.slideDetails = data.slide;
          console.log(this.slideDetails)
          this.selectedSlideId = this.slideDetails._id
          this._location.go(Constants.Pages.SLIDE_DETAILS.replace(':id', this.selectedCourseId).replace(':slideid', this.selectedSlideId));
          console.log(this.slideDetails.name, " = getSlideDetails:isCompleted = ", this.slideDetails.isCompleted);

          if (!this.slideDetails.isCompleted)
            this.markProgress(this.slideDetails);
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
  }

  markProgress(slide: any, isCompleted: boolean = false) {

    this.apiService
      .post(apiConstants.markProgress.replace(":id", this.selectedCourseId).replace(':slideid', slide._id), { isCompleted })
      .subscribe({
        next: (data) => {
          console.log(slide.name, " = markProgress:isCompleted = ", data.progress.isCompleted);
          this.slides[slide.position - 1].isCompleted = data.progress.isCompleted;
        },
        error: (e) => {
          this.errorHandlingService.handle(e);
        },
      });
  }

  progress: any;
  getProgress() {
    this.apiService
      .get(apiConstants.getProgress.replace(":id", this.selectedCourseId))
      .subscribe({
        next: ({ progress }) => {
          this.progress = progress
          let selectedSilde = progress[0] ? progress[0].slide : this.slides[0]
          this.getSlideDetails(selectedSilde)
          this.selectedSlideId = selectedSilde._id;
          this._location.go(Constants.Pages.SLIDE_DETAILS.replace(':id', this.selectedCourseId).replace(':slideid', this.selectedSlideId));
        },
        error: (e) => {
          this.errorHandlingService.handle(e);
        },
      });
  }

  nextSlide() {
    let slide = this.slides.filter((slide: any) => this.slideDetails.position + 1 == slide.position)[0];
    if (slide) {
      this.markProgress(this.slideDetails, true);

      this.getSlideDetails(slide)
    }
  }

}
