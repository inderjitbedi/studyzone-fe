import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
// import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { Validator } from 'src/app/providers/Validator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/providers/alert.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private apiService: CommonAPIService, public alertService: AlertService,
    private activeRoute: ActivatedRoute, private router: Router,
    public matcher: ErrorStateMatcherService) {

    this.resetPasswordForm = this.formBuilder.group({
      token: ['', [Validators.required,]],
      // password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(Validator.passwordValidator.pattern), this.noWhitespaceValidator]],
      confirmPassword: ['', [Validators.required]],
    });
    this.activeRoute.params.subscribe({
      next: ({ token, email }: any) => {
        this.resetPasswordForm.controls['token'].setValue(token);
      }
    })
    this.resetPasswordForm.controls['newPassword'].valueChanges.subscribe(password => {
      if (this.resetPasswordForm.controls['newPassword'].valid) {
        if (this.resetPasswordForm.controls['confirmPassword'].errors) {
          delete this.resetPasswordForm.controls['confirmPassword'].errors['invalid-password'];
        }
        if (this.resetPasswordForm.controls['newPassword'].value !== this.resetPasswordForm.controls['confirmPassword'].value) {
          this.resetPasswordForm.controls['confirmPassword'].setErrors({ 'password-mismatch': true });
        } else {
          if (this.resetPasswordForm.controls['confirmPassword'].errors) {
            delete this.resetPasswordForm.controls['confirmPassword'].errors['password-mismatch'];
          }
        }
        if (this.resetPasswordForm.controls['confirmPassword'].errors) {
          this.resetPasswordForm.controls['confirmPassword'].setErrors(null);
        }
      } else {
        if (this.resetPasswordForm.controls['confirmPassword'].value) {
          this.resetPasswordForm.controls['confirmPassword'].setErrors({ 'invalid-password': true });
        }
      }

    });
    this.resetPasswordForm.controls['confirmPassword'].valueChanges.subscribe(confirmPassword => {
      if (confirmPassword && this.resetPasswordForm.controls['confirmPassword'].valid) {
        if (this.resetPasswordForm.controls['newPassword'].valid) {
          if (this.resetPasswordForm.controls['newPassword'].value !== this.resetPasswordForm.controls['confirmPassword'].value) {
            this.resetPasswordForm.controls['confirmPassword'].setErrors({ 'password-mismatch': true });
          } else {
            if (this.resetPasswordForm.controls['confirmPassword'].errors) {
              delete this.resetPasswordForm.controls['confirmPassword'].errors['password-mismatch'];
            }
          }
          if (this.resetPasswordForm.controls['confirmPassword'].errors) {
            delete this.resetPasswordForm.controls['confirmPassword'].errors['invalid-password'];
          }
        } else {
          this.resetPasswordForm.controls['confirmPassword'].setErrors({ 'invalid-password': true });
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


  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      let token = this.resetPasswordForm.value.token;
      delete this.resetPasswordForm.value.token;
      delete this.resetPasswordForm.value.confirmPassword;
      
      this.apiService
        .post(apiConstants.resetPassword.replace(':token', token), this.resetPasswordForm.value)
        .subscribe({
          next: (data) => {
            // if (data.statusCode === 201 || data.statusCode === 200) {
            this.alertService.notify(data.message);
            this.router.navigate([Constants.Pages.LOGIN]);
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
