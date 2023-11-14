import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
// import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { Validator } from 'src/app/providers/Validator';
import { debounceTime } from 'rxjs';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { AlertService } from 'src/app/providers/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isCompleteSignupPage: boolean = false;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private apiService: CommonAPIService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public matcher: ErrorStateMatcherService
  ) {
    this.signupForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.emailValidator.pattern),
        ],
      ],
      token: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.passwordValidator.pattern),
          this.noWhitespaceValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });
    this.activeRoute.params.subscribe({
      next: ({ token, email }: any) => {
        this.signupForm.controls['token'].setValue(token);
        this.signupForm.controls['email'].setValue(email);
        if (token && email) {
          this.isCompleteSignupPage = true;
        } else {
          console.log(this.router.url);
          this.signupForm.removeControl('token');
        }
      },
    });
    // this.signupForm.controls['email'].valueChanges.pipe(debounceTime(500)).subscribe((email: any) => {
    //   if (email && this.signupForm.controls['email'].valid) {
    //     this.apiService.get(apiConstants.emailUniqueness + email).subscribe({
    //       next: (data) => {
    //         // if (data && (data.statusCode === 200)) {
    //         if (data.isUnique !== true) {
    //           this.signupForm.controls['email'].setErrors({ 'not_unique': true });
    //         } else {
    //           if (this.signupForm.controls['email'].errors) {
    //             delete this.signupForm.controls['email'].errors['not_unique'];
    //           }
    //         }
    //         // } else {
    //         //   this.errorHandlingService.handle(data);
    //         // }
    //       },
    //       error: (e) => {
    //         this.errorHandlingService.handle(e);
    //       },
    //     })
    //   }
    // })

    this.signupForm.controls['password'].valueChanges.subscribe((password) => {
      if (this.signupForm.controls['password'].valid) {
        if (this.signupForm.controls['confirmPassword'].errors) {
          delete this.signupForm.controls['confirmPassword'].errors[
            'invalid-password'
          ];
        }
        if (
          this.signupForm.controls['password'].value !==
          this.signupForm.controls['confirmPassword'].value
        ) {
          this.signupForm.controls['confirmPassword'].setErrors({
            'password-mismatch': true,
          });
        } else {
          if (this.signupForm.controls['confirmPassword'].errors) {
            delete this.signupForm.controls['confirmPassword'].errors[
              'password-mismatch'
            ];
          }
        }
        if (this.signupForm.controls['confirmPassword'].errors) {
          this.signupForm.controls['confirmPassword'].setErrors(null);
        }
      } else {
        if (this.signupForm.controls['confirmPassword'].value) {
          this.signupForm.controls['confirmPassword'].setErrors({
            'invalid-password': true,
          });
        }
      }
    });
    this.signupForm.controls['confirmPassword'].valueChanges.subscribe(
      (confirmPassword) => {
        if (
          confirmPassword &&
          this.signupForm.controls['confirmPassword'].valid
        ) {
          if (this.signupForm.controls['password'].valid) {
            if (
              this.signupForm.controls['password'].value !==
              this.signupForm.controls['confirmPassword'].value
            ) {
              this.signupForm.controls['confirmPassword'].setErrors({
                'password-mismatch': true,
              });
            } else {
              if (this.signupForm.controls['confirmPassword'].errors) {
                delete this.signupForm.controls['confirmPassword'].errors[
                  'password-mismatch'
                ];
              }
            }
            if (this.signupForm.controls['confirmPassword'].errors) {
              delete this.signupForm.controls['confirmPassword'].errors[
                'invalid-password'
              ];
            }
          } else {
            this.signupForm.controls['confirmPassword'].setErrors({
              'invalid-password': true,
            });
          }
        }
      }
    );
  }

  noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').indexOf(' ') > -1;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  ngOnInit(): void {}

  signup(): void {
    if (this.signupForm.valid) {
      let token = this.signupForm.value.token;
      // delete this.signupForm.value.token;
      delete this.signupForm.value.confirmPassword;
      if (this.isCompleteSignupPage) {
        this.apiService
          .put(
            apiConstants.completeSignup.replace(':token', token),
            this.signupForm.value
          )
          .subscribe({
            next: (data) => {
              console.log(data);
              // if (data.statusCode === 201 || data.statusCode === 200) {
              localStorage.setItem('auth_token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              this.router.navigate([Constants.Pages.ALL_COURSES]);
              // } else {
              //   this.errorHandlingService.handle(data);
              // }
            },
            error: (e) => {
              this.errorHandlingService.handle(e);
            },
          });
      } else {
        this.apiService
          .post(apiConstants.signup, this.signupForm.value)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.alertService.notify(
                'Thank you for signing up! Your account is pending admin approval.',
                'success',
                10000
              );
              this.router.navigate([Constants.Pages.LOGIN]);
            },
            error: (e) => {
              this.errorHandlingService.handle(e);
            },
          });
      }
    }
  }
}
