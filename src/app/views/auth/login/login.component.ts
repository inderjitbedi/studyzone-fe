import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
// import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { Validator } from 'src/app/providers/Validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private apiService: CommonAPIService,
    private router: Router // public matcher: ErrorStateMatcherService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.emailValidator.pattern),
        ],
      ],
      password: ['', Validators.required],
    });
  }
  login(): void {
    if (this.loginForm.valid) {
      this.apiService
        .post(apiConstants.signin, this.loginForm.value)
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
