import { Component, Inject, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/providers/eventEmitter.provider';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent implements OnInit {
  public dialogData: any = {};
  constructor(private emitter: EventEmitterService) {
    this.emitter.alert.subscribe({
      next: (data: any) => {
        this.dialogData = data;
        this.openPopup();
        // if (data.autoClose) {
        setTimeout(() => {
          this.closePopup();
        }, data.autoCloseTime || 3000);
        // }
      },
    });
  }

  ngOnInit(): void {}

  displayStyle = 'none';

  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
}
