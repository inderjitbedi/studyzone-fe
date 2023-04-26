import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
// import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { Validator } from 'src/app/providers/Validator';
import { debounceTime } from 'rxjs';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private apiService: CommonAPIService,
    private activeRoute: ActivatedRoute,
    private router: Router // public matcher: ErrorStateMatcherService
  ) {



    this.signUpForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(Validator.emailValidator.pattern)],
      ],
      inviteToken: ['', [Validators.required,]],
      fullName: ['', [Validators.required,]],
      password: ['', [Validators.required, Validators.pattern(Validator.passwordValidator.pattern), this.noWhitespaceValidator]],
      confirmPassword: ['', [Validators.required]],
    });
    this.activeRoute.params.subscribe({
      next: ({ inviteToken }: any) => {
        this.signUpForm.controls['inviteToken'].setValue(inviteToken);
      }
    })
    this.signUpForm.controls['email'].valueChanges.pipe(debounceTime(500)).subscribe((email: any) => {
      if (email && this.signUpForm.controls['email'].valid) {
        this.apiService.get(apiConstants.emailUniqueness + email).subscribe({
          next: (data) => {
            // if (data && (data.statusCode === 200)) {
            if (data.isUnique === true) {
              this.signUpForm.controls['email'].setErrors({ 'not_unique': true });
            } else {
              if (this.signUpForm.controls['email'].errors) {
                delete this.signUpForm.controls['email'].errors['not_unique'];
              }
            }
            // } else {
            //   this.errorHandlingService.handle(data);
            // }
          },
          error: (e) => {
            this.errorHandlingService.handle(e);
          },
        })
      }
    })

    this.signUpForm.controls['password'].valueChanges.subscribe(password => {
      if (this.signUpForm.controls['password'].valid) {
        if (this.signUpForm.controls['confirmPassword'].errors) {
          delete this.signUpForm.controls['confirmPassword'].errors['invalid-password'];
        }
        if (this.signUpForm.controls['password'].value !== this.signUpForm.controls['confirmPassword'].value) {
          this.signUpForm.controls['confirmPassword'].setErrors({ 'password-mismatch': true });
        } else {
          if (this.signUpForm.controls['confirmPassword'].errors) {
            delete this.signUpForm.controls['confirmPassword'].errors['password-mismatch'];
          }
        }
        if (this.signUpForm.controls['confirmPassword'].errors) {
          this.signUpForm.controls['confirmPassword'].setErrors(null);
        }
      } else {
        if (this.signUpForm.controls['confirmPassword'].value) {
          this.signUpForm.controls['confirmPassword'].setErrors({ 'invalid-password': true });
        }
      }

    });
    this.signUpForm.controls['confirmPassword'].valueChanges.subscribe(confirmPassword => {
      if (confirmPassword && this.signUpForm.controls['confirmPassword'].valid) {
        if (this.signUpForm.controls['password'].valid) {
          if (this.signUpForm.controls['password'].value !== this.signUpForm.controls['confirmPassword'].value) {
            this.signUpForm.controls['confirmPassword'].setErrors({ 'password-mismatch': true });
          } else {
            if (this.signUpForm.controls['confirmPassword'].errors) {
              delete this.signUpForm.controls['confirmPassword'].errors['password-mismatch'];
            }
          }
          if (this.signUpForm.controls['confirmPassword'].errors) {
            delete this.signUpForm.controls['confirmPassword'].errors['invalid-password'];
          }
        } else {
          this.signUpForm.controls['confirmPassword'].setErrors({ 'invalid-password': true });
        }
      }
    });
  }

  noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').indexOf(' ') > -1;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  ngOnInit(): void {
  }

  signup(): void {
    if (this.signUpForm.valid) {
      this.apiService
        .post(apiConstants.signin, this.signUpForm.value)
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
    }
  }
}
