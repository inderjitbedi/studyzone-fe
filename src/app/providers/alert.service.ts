import { Injectable } from '@angular/core';
import { EventEmitterService } from './eventEmitter.provider';

@Injectable()
export class AlertService {
  closeName = 'End Now';
  constructor(private eventEmitter: EventEmitterService) {}

  notify(message: string = '', type: string = 'success'): void {
    this.eventEmitter.toggleAlert({ message, type });
  }
}
