import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { Validator } from 'src/app/providers/Validator';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EventEmitterService } from 'src/app/providers/eventEmitter.provider';
import { AlertService } from 'src/app/providers/alert.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  changePasswordForm: FormGroup;
  profileForm: FormGroup;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private apiService: CommonAPIService,
    public matcher: ErrorStateMatcherService,
    private emitter: EventEmitterService,
    public alertService: AlertService
  ) {
    this.profileForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
    });

    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.passwordValidator.pattern),
          this.noWhitespaceValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });

    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe(
      (password) => {
        if (this.changePasswordForm.controls['newPassword'].valid) {
          if (this.changePasswordForm.controls['confirmPassword'].errors) {
            delete this.changePasswordForm.controls['confirmPassword'].errors[
              'invalid-password'
            ];
          }
          if (
            this.changePasswordForm.controls['newPassword'].value !==
            this.changePasswordForm.controls['confirmPassword'].value
          ) {
            this.changePasswordForm.controls['confirmPassword'].setErrors({
              'password-mismatch': true,
            });
          } else {
            if (this.changePasswordForm.controls['confirmPassword'].errors) {
              delete this.changePasswordForm.controls['confirmPassword'].errors[
                'password-mismatch'
              ];
            }
          }
          if (this.changePasswordForm.controls['confirmPassword'].errors) {
            this.changePasswordForm.controls['confirmPassword'].setErrors(null);
          }
        } else {
          if (this.changePasswordForm.controls['confirmPassword'].value) {
            this.changePasswordForm.controls['confirmPassword'].setErrors({
              'invalid-password': true,
            });
          }
        }
      }
    );
    this.changePasswordForm.controls['confirmPassword'].valueChanges.subscribe(
      (confirmPassword) => {
        if (
          confirmPassword &&
          this.changePasswordForm.controls['confirmPassword'].valid
        ) {
          if (this.changePasswordForm.controls['newPassword'].valid) {
            if (
              this.changePasswordForm.controls['newPassword'].value !==
              this.changePasswordForm.controls['confirmPassword'].value
            ) {
              this.changePasswordForm.controls['confirmPassword'].setErrors({
                'password-mismatch': true,
              });
            } else {
              if (this.changePasswordForm.controls['confirmPassword'].errors) {
                delete this.changePasswordForm.controls['confirmPassword']
                  .errors['password-mismatch'];
              }
            }
            if (this.changePasswordForm.controls['confirmPassword'].errors) {
              delete this.changePasswordForm.controls['confirmPassword'].errors[
                'invalid-password'
              ];
            }
          } else {
            this.changePasswordForm.controls['confirmPassword'].setErrors({
              'invalid-password': true,
            });
          }
        }
      }
    );
  }

  ngOnInit(): void {
    this.getUser();
  }
  noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').indexOf(' ') > -1;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      delete this.changePasswordForm.value.confirmPassword;
      console.log(this.changePasswordForm.value);

      this.apiService
        .put(apiConstants.changePassword, this.changePasswordForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.changePasswordForm.reset();
            Object.keys(this.changePasswordForm.controls).forEach((key) => {
              this.changePasswordForm.get(key)?.setErrors(null);
            });
            this.alertService.notify(data.message);
            // if (data.statusCode === 201 || data.statusCode === 200) {
            // this.router.navigate([Constants.Pages.LOGIN]);
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
  getUser() {
    let userString = localStorage.getItem('user');
    let user = JSON.parse(userString + '');
    this.profileForm.controls['fullName'].setValue(user.fullName);
  }
  updateProfile(): void {
    if (this.profileForm.valid) {
      this.apiService
        .put(apiConstants.profile, this.profileForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.emitter.profileUpdated(data);
            this.alertService.notify(data.message);
            // if (data.statusCode === 201 || data.statusCode === 200) {
            // this.router.navigate([Constants.Pages.LOGIN]);
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
