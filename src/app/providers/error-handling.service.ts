import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { AuthGuard } from './auth.guard';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {

    constructor(public alertService: AlertService, private authGuard: AuthGuard) { }

    handle(error: any): void {
        if (error && error.status === 401) {
            this.authGuard.sessionExpired(error.error.message);
        } else if (typeof error === 'string') {
            this.alertService.notify(error, 'error');
        } else {
            this.alertService.notify(error.error && error.error.message ?
                error.error.message : (error && error.status != 0 && error.message ? error.message : ('Server not responding. Please try later.')), 'error');
        }
    }
}
