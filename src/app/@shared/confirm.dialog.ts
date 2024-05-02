import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
      <div class="brand_info">
        <h2 class="text-center">{{ title }}</h2>
    </div>

    <div mat-dialog-content class="text-center">
      <p [innerHTML]="message" class="text-center mb-0"></p>
    </div>

    <div mat-dialog-actions class="d-flex justify-content-center">
      <div *ngIf="status; else elseBlock">
        <button mat-raised-button color="primary" (click)="onConfirm()">OK</button>
      </div>
      <ng-template #elseBlock>
        <!-- <button mat-raised-button class="bnt btn-outline-primary" color="primary" [style.background-color]="'#FF6528'" (click)="onConfirm()">Yes</button>
        <button mat-raised-button class="bnt btn-primary" (click)="onDismiss()">No</button> -->
        <div class="header_add_button d-flex align-items-center gap-3">
            <div class="position-relative">
                <button class="btn btn-primary d-flex align-items-center gap-2 justify-content-center"
                    (click)="onConfirm()">
                    Yes
                </button>
            </div>
            <button class="btn btn-outline-primary" (click)="onDismiss()">No</button>
        </div>
      </ng-template>
    </div>
  `,
})
export class ConfirmDialogComponent implements OnInit {
  title: string = 'Are you sure you want to do this?';
  message: string = 'Confirm Action';
  status: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.status = data.status;
  }

  ngOnInit() { }

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
  constructor(public title: string, public message: any, public status: boolean) { }
}

