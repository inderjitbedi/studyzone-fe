import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  @Output() profile: EventEmitter<any> = new EventEmitter();

  profileUpdated(data:any): void {
    this.profile.emit(data);
  }
}
