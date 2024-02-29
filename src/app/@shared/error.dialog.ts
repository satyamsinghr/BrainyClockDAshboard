    import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { Component, OnInit, Inject } from '@angular/core';
    import { MatTableDataSource, MatTableModule } from '@angular/material/table';
    @Component({
        selector: 'app-confirm-dialog',
        standalone: true,
        imports: [MatTableModule],
        template: `
    <div class="d-flex align-items-center justify-content-between mb-3">  <h2 style="font-size: 20px;margin: 0;font-weight: 600;text-transform: capitalize;">Error Messages</h2>
    <button class="clode_modal" mat-raised-button (click)="onDismiss()" style="border-color: transparent; border-radius: 20px;"><span>&times;</span></button>
    </div>
    <div class="error_table">
        <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="sNo">
        <th mat-header-cell *matHeaderCellDef>S.no</th>
        <td mat-cell *matCellDef="let element; let i=index">{{ i + 1 }}</td>
    </ng-container>
    <ng-container matColumnDef="companyName">
        <th mat-header-cell *matHeaderCellDef>Company Name</th>
        <td mat-cell *matCellDef="let element">{{ element.companyName }}</td>
    </ng-container>
    <ng-container matColumnDef="message">
        <th mat-header-cell *matHeaderCellDef>Message</th>
        <td mat-cell *matCellDef="let element">{{ element.message }}</td>
    </ng-container>

        <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsToDisplay;"></tr>
        </table>
        </div>
    `,
    })
    export class ErrorDialogComponent implements OnInit {
        title: string = 'Are you sure you want to do this?';
        message: any;
        status: boolean = false;
        errors: any[] = [];
        constructor(
            public dialogRef: MatDialogRef<ErrorDialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: ErrorDialogModel
        ) {
            this.title = data.title;
            this.message = data.message;
            this.status = data.status;
        }
        columnsToDisplay: string[] = ['sNo', 'companyName', 'message'];
        dataSource: MatTableDataSource<any>;
        msg: any
        ngOnInit() {
            const flattenedErrors = this.flattenErrors( this.message );
            this.dataSource = new MatTableDataSource(flattenedErrors);
        }
        flattenErrors(errors: any[]): any[] {
            return errors.reduce((flattened, errorObj, sNo) => {
            const { row, errors } = errorObj;
            const companyName = row?.companyName;
            if (errors && errors.length > 0) { 
                errors.forEach((message: string) => {
                flattened.push({ sNo: sNo + 1, companyName, message });
                });
            }
            return flattened;
            }, []);
        }
        onConfirm(): void {
            this.dialogRef.close(true);
        }

        onDismiss(): void {
            this.message= [];
            this.dialogRef.close(false);
        }
    }
    export class ErrorDialogModel {
        errors: any[];
        constructor(public title: string, public message: any, public status: boolean) { }
    }

