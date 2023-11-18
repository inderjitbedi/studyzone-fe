import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { environment } from 'src/environments/environment';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  PaymentIntent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  stripeTest!: FormGroup;

  baseUrl: any = environment.baseUrl;
  selectedCourseId: any;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: CommonAPIService,
    public alertService: AlertService,
    private fb: FormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private stripeService: StripeService
  ) {
    this.activeRoute.params.subscribe({
      next: (route) => {
        this.selectedCourseId = route['id'];
        this.getCourseDetails();
      },
    });
  }

  pay(): void {
    if (this.stripeTest.valid) {
      this.createPaymentIntent(this.stripeTest.get('amount')?.value)
        .pipe(
          switchMap((pi: any) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.stripeTest.get('name')?.value,
                },
              },
            })
          )
        )
        .subscribe((result: any) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
            }
          }
        });
    } else {
      console.log(this.stripeTest);
    }
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.apiService.post(`/create-payment-intent`, { amount });
  }
  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      email: ['', [Validators.required]],
    });
  }
  back() {
    this.router.navigate(['/dashboard/courses/all-courses']);
  }
  apiCallActive: boolean = false;
  courseDetails: any;
  getCourseDetails() {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.getCourseDetails.replace(':id', this.selectedCourseId))
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
        .post(
          apiConstants.requestEnrollment.replace(':id', this.selectedCourseId),
          {}
        )
        .subscribe({
          next: (data) => {
            this.apiCallActive = false;
            this.alertService.notify(data.message);
            this.getCourseDetails();
          },
          error: (e) => {
            this.apiCallActive = false;
            this.errorHandlingService.handle(e);
          },
        });
    }
  }
  resumeCourse() {
    this.router.navigate([
      Constants.Pages.MY_COURSE_DETAILS.replace(':id', this.selectedCourseId),
    ]);
  }
  enrollCourse() {
    this.apiCallActive = true;
    this.apiService
      .post(apiConstants.enrollCourse.replace(':id', this.selectedCourseId), {})
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.router.navigate([
            Constants.Pages.MY_COURSE_DETAILS.replace(
              ':id',
              data.enrollment.course
            ),
          ]);
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
  }
}
