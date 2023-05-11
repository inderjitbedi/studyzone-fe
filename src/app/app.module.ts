import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertService } from './providers/alert.service';
import { CommonAPIService } from './providers/api.service';
import { AuthGuard } from './providers/auth.guard';
import { AuthInterceptor } from './providers/auth.interceptor';
import { GetSetService } from './providers/getSet.provider';
import { LoaderInterceptor } from './providers/loader.interceptor';
import { LoaderService } from './providers/loader.service';
import { LoaderComponent } from './views/common/loader/loader.component';
import { AlertDialogComponent } from './views/common/alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [AppComponent, LoaderComponent, AlertDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    // LoaderModule,
  ],
  providers: [
    CommonAPIService,
    AuthGuard,
    AlertService,
    GetSetService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})


export class AppModule {}
