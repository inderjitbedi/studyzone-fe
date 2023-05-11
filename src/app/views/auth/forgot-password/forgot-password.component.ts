import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validator } from 'src/app/providers/Validator';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private apiService: CommonAPIService, public alertService: AlertService,
    private router: Router, public matcher: ErrorStateMatcherService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        '', [Validators.required, Validators.pattern(Validator.emailValidator.pattern),],
      ],

    });
  }

  forgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      this.apiService
        .post(apiConstants.forgotPassword, this.forgotPasswordForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);
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
  ngOnInit(): void {
  }

}
