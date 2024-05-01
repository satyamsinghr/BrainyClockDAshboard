import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title style="margin-bottom:0" cdkFocusRegionStart>
      {{ title }}
    </h1>

    <div mat-dialog-content>
      <p [innerHTML]="message"></p>
    </div>

    <div mat-dialog-actions class="d-flex justify-content-center">
      <div *ngIf="status; else elseBlock">
        <button mat-raised-button color="primary" (click)="onConfirm()">OK</button>
      </div>
      <ng-template #elseBlock>
        <button mat-raised-button color="primary" [style.background-color]="'#FF6528'" (click)="onConfirm()">Yes</button>
        <button mat-raised-button (click)="onDismiss()">No</button>
      </ng-template>
    </div>
  `,
})
export class ConfirmDialogComponent implements OnInit {
  title: string = 'Are you sure you want to do this?';
  message: string = 'Confirm Action';
  status:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.status= data.status;
  }

  ngOnInit() {}

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {
  constructor(public title: string, public message: any, public status:boolean) {}
}

