import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  @Output() profile: EventEmitter<any> = new EventEmitter();

  profileUpdated(data:any): void {
    this.profile.emit(data);
  }
  @Output() alert: EventEmitter<any> = new EventEmitter();

  toggleAlert(data:any): void {
    console.log('here in toggleAlert');

    this.alert.emit(data);
  }
}
