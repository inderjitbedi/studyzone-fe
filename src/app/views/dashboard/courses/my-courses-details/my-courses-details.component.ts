import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-courses-details',
  templateUrl: './my-courses-details.component.html',
  styleUrls: ['./my-courses-details.component.scss'],
})
export class MyCoursesDetailsComponent implements OnInit {
  baseUrl: any = environment.baseUrl;

  selectedCourseId: any;
  constructor(
    private router: Router,
    public sanitizer: DomSanitizer,
    private activeRoute: ActivatedRoute,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    private _location: Location
  ) {
    this.activeRoute.params.subscribe({
      next: (route) => {
        this.selectedCourseId = route['id'];
        this.getCourseDetails();
      },
    });
  }

  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  ngOnInit(): void {}
  back() {
    this.router.navigate(['/dashboard/courses/my-courses']);
  }

  apiCallActive: boolean = false;
  courseDetails: any;
  slides: any = [];
  getCourseDetails() {
    this.apiCallActive = true;
    this.apiService
      .get(
        apiConstants.getMyCourseDetails.replace(':id', this.selectedCourseId)
      )
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.courseDetails = data.courseDetails;
          this.getProgress();
          this.slides = data.slides;
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
        complete: () => {
          this.apiCallActive = false;
        },
      });
  }
  slideDetails: any = {};
  selectedSlideId: any;
  getSlideDetails(slide: any) {
    if (this.slideDetails?._id) {
      if (!this.slideDetails.isCompleted)
        this.markProgress(this.slideDetails, true);
    }
    this.apiCallActive = true;
    this.apiService
      .get(
        apiConstants.getSlideDetails
          .replace(':id', this.selectedCourseId)
          .replace(':slideid', slide._id)
      )
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.slideDetails = data.slide;
          console.log(this.slideDetails);
          this.selectedSlideId = this.slideDetails._id;
          this._location.go(
            Constants.Pages.SLIDE_DETAILS.replace(
              ':id',
              this.selectedCourseId
            ).replace(':slideid', this.selectedSlideId)
          );
          console.log(
            this.slideDetails.name,
            ' = getSlideDetails:isCompleted = ',
            this.slideDetails.isCompleted
          );

          if (!this.slideDetails.isCompleted)
            this.markProgress(this.slideDetails);
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
        complete: () => {
          this.apiCallActive = false;
        },
      });
  }

  markProgress(slide: any, isCompleted: boolean = false) {
    this.apiCallActive = true;
    this.apiService
      .post(
        apiConstants.markProgress
          .replace(':id', this.selectedCourseId)
          .replace(':slideid', slide._id),
        { isCompleted }
      )
      .subscribe({
        next: (data) => {
          // console.log(slide.name, " = markProgress:isCompleted = ", data.progress.isCompleted);
          this.slides[slide.position - 1].isCompleted =
            data.progress.isCompleted;
          this.getProgress();
          this.apiCallActive = false;
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
        complete: () => {
          this.apiCallActive = false;
        },
      });
  }

  progress: any;
  percentComplete: any = 0;
  getProgress() {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.getProgress.replace(':id', this.selectedCourseId))
      .subscribe({
        next: ({ progress, percentComplete }) => {
          this.progress = progress;
          this.percentComplete = percentComplete;

          if (!this.slideDetails._id) {
            let selectedSilde = progress[0]
              ? progress[0].slide
              : this.slides[0];
            this.getSlideDetails(selectedSilde);
            this.selectedSlideId = selectedSilde._id;
            this._location.go(
              Constants.Pages.SLIDE_DETAILS.replace(
                ':id',
                this.selectedCourseId
              ).replace(':slideid', this.selectedSlideId)
            );
          }

          this.apiCallActive = false;
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
        complete: () => {
          this.apiCallActive = false;
        },
      });
  }

  nextSlide() {
    let slide = this.slides.filter(
      (slide: any) => this.slideDetails.position + 1 == slide.position
    )[0];
    if (slide) {
      this.markProgress(this.slideDetails, true);
      this.getSlideDetails(slide);
    }
  }

  finishCourse() {
    this.back();
  }
}
