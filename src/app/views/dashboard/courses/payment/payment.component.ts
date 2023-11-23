import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { environment } from 'src/environments/environment';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';

import {
  StripeService,
  StripeCardComponent,
  StripeCardNumberComponent,
} from 'ngx-stripe';
import {
  PaymentIntent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { LoaderService } from 'src/app/providers/loader.service';
import { Validator } from 'src/app/providers/Validator';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;
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

  promotionApplied: boolean = false;
  addPromoCode: boolean = false;
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  stripeForm!: FormGroup;
  promoCodeForm!: FormGroup;
  skipPaymentForm!: FormGroup;
  baseUrl: any = environment.baseUrl;
  selectedCourseId: any;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: CommonAPIService,
    public alertService: AlertService,
    private fb: FormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private stripeService: StripeService,
    private loaderService: LoaderService,
    public matcher: ErrorStateMatcherService
  ) {
    this.activeRoute.params.subscribe({
      next: (route) => {
        this.selectedCourseId = route['id'];
        this.getCourseDetails();
      },
    });
  }
  ngOnInit(): void {
    this.promoCodeForm = this.fb.group({
      code: ['', [Validators.required]],
    });
    this.skipPaymentForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.emailValidator.pattern),
        ],
      ],
    });

    this.stripeForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.emailValidator.pattern),
        ],
      ],
      name: ['', [Validators.required]],
    });
  }
  back() {
    this.router.navigate([
      '/dashboard/courses/course',
      this.selectedCourseId,
      'details',
    ]);
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
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
  }
  skipPayment(): void {
    if (this.skipPaymentForm.valid && this.couponResponse?.finalPrice === 0) {
      let payload = {
        course: this.selectedCourseId,
        coupon: this.couponResponse?.coupon || null,
        stripePaymentId: null,
        stripePaymentMethodId: null,
        amount: 0,
        status: 'succeeded',
        email: this.skipPaymentForm.get('email')?.value,
      };
      this.apiService.post(apiConstants.saveTransaction, payload).subscribe({
        next: (data) => {
          this.apiCallActive = false;
          if (payload.status === 'succeeded')
            this.router.navigate([
              '/dashboard/courses/course',
              this.selectedCourseId,
              'details',
            ]);
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
        complete: () => {
          this.loaderService.show(false);
          this.apiCallActive = false;
        },
      });
    }
  }
  pay(): void {
    if (this.stripeForm.valid) {
      this.apiCallActive = true;
      this.loaderService.show(true);
      this.createPaymentIntent(
        this.couponResponse?.finalPrice || this.courseDetails.price
      )
        .pipe(
          switchMap((pi: any) => {
            console.log('createPaymentIntent res', pi);
            return this.stripeService.confirmCardPayment(pi.clientSecret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  email: this.stripeForm.get('email')?.value,
                  name: this.stripeForm.get('name')?.value,
                },
              },
            });
          })
        )
        .subscribe((result: any) => {
          console.log(result);
          let payload: any = {};
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
            payload = {
              course: this.selectedCourseId,
              coupon: this.couponResponse?.coupon || null,
              stripePaymentId: result?.error?.payment_intent?.id || null,
              stripePaymentMethodId: result?.error?.payment_method?.id || null,
              amount: result?.error?.payment_intent?.amount / 100 || null,
              // this.couponResponse?.finalPrice || this.courseDetails.price,
              status: result?.error?.code || null,
              email: this.stripeForm.get('email')?.value,
              nameOnCard: this.stripeForm.get('name')?.value,
            };
            this.errorHandlingService.handle(result.error);
            console.log('errorr = ', payload);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              payload = {
                course: this.selectedCourseId,
                coupon: this.couponResponse?.coupon || null,
                stripePaymentId: result?.paymentIntent?.id || null,
                stripePaymentMethodId:
                  result?.paymentIntent?.payment_method || null,
                amount: result?.paymentIntent?.amount / 100 || null,
                // this.couponResponse?.finalPrice || this.courseDetails.price,
                status: result?.paymentIntent?.status || null,
                email: this.stripeForm.get('email')?.value,
                nameOnCard: this.stripeForm.get('name')?.value,
              };
              console.log('success = ', payload);
              this.alertService.notify('Payment done successfully');
            }
          }

          this.apiService
            .post(apiConstants.saveTransaction, payload)
            .subscribe({
              next: (data) => {
                this.apiCallActive = false;
                if (payload.status === 'succeeded')
                  this.router.navigate([
                    '/dashboard/courses/course',
                    this.selectedCourseId,
                    'details',
                  ]);
              },
              error: (e) => {
                this.apiCallActive = false;
                this.errorHandlingService.handle(e);
              },
              complete: () => {
                this.loaderService.show(false);
                this.apiCallActive = false;
              },
            });
        });
    } else {
      console.log(this.stripeForm);
    }
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.apiService.post(apiConstants.paymentIntent, { amount });
  }
  removeCoupon() {
    this.promotionApplied = false;
    this.addPromoCode = false;
    this.couponResponse = {};
    this.promoCodeForm.reset();
  }
  couponResponse: any = {};
  applyPromo() {
    if (!this.promoCodeForm.invalid) {
      this.apiCallActive = true;
      this.apiService
        .get(
          apiConstants.applyPromo
            .replace(':id', this.selectedCourseId)
            .replace(':promo', this.promoCodeForm.value.code)
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.couponResponse = data;
            this.apiCallActive = false;
            this.promotionApplied = true;
            // this.promoCodeForm.reset();
            // this.alertService.notify(data.message);
            // this.getCourseDetails();
          },
          error: (e) => {
            this.apiCallActive = false;
            this.errorHandlingService.handle(e);
          },
        });
    }
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
