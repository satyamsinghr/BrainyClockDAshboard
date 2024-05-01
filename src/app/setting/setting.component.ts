import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MatTableDataSource } from '@angular/material/table';
import { viewEmployeeItemDto } from './../@shared/models/viewEmployee.model';
import { Emp_Data } from '../@shared/models/dataSource';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../@shared/confirm.dialog';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  submitted = false;
  spinner: boolean = false;
  comapnyId: any;
  spinnerShow: string = '';
  timezoneForm: FormGroup;
  showTimeZoneFormFlag: boolean = false
  timezones: string[] = moment.tz.names();
  intervals = ['1 day', '1 week', '1 month'];
  submitButtonDisabled: boolean = false;
  nameOfCompany = JSON.parse(localStorage.getItem('nameOfCompany'));

  scheduleData: any = [];
  // createSchudleData : any = []
  @ViewChild('timezoneFormData') timezoneFormData: any;

  dataSource = new MatTableDataSource(this.scheduleData);
  // dataSource = new MatTableDataSource<viewEmployeeItemDto>(Emp_Data);
  displayedColumns: string[] = ['timezone', 'interval', 'action',];
  lastUrl: any;
  constructor(private fb: FormBuilder,
    private router:Router, 
    private service: AppService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sharedService :SharedService
    // public dialogRef: MatDialogRef<SettingComponent> ,
  ) { }


  ngOnInit() {
    const Url  = this.router.url;
    console.log("testtt",Url);
    
    const parts = Url.split('/');
    this.lastUrl = parts[parts.length - 1];
    this.sharedService.setLastUrl(this.lastUrl);
    console.log("LastURL",this.lastUrl)
    this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
    // this.scheduleData = JSON.parse(localStorage.getItem('SchudleGetData'));
    this.timezoneForm = this.fb.group({
      id: [''],
      companyId: [],
      timezone: ['', Validators.required],
      interval: ['', Validators.required],

    });
    this.getSchudleByCompanyId();
  }


  ngAfterViewInit() {
    if (this.timezoneFormData) {
      console.log('Form reference:', this.timezoneFormData);
    } else {
      console.error('Form reference is undefined.');
    }
  }

  openTimeZoneFormDialog(elRef: any) {
    const dialogRef = this.dialog.open(elRef, {
      width: '100%', maxWidth: '420px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit department modal was closed');
    });
  }
  getSchudleByCompanyId() {
    this.service.getSchudle(this.comapnyId).subscribe(
      (response: any) => {
        this.scheduleData = response.data[0];
        console.log("scheduleData", this.scheduleData);
        if (this.scheduleData) {
          this.timezoneForm.patchValue({
            id: this.scheduleData.Id,
            companyId: this.scheduleData.CompanyId,
            timezone: this.scheduleData.Timezone,
            interval: this.scheduleData.TimeInterval
          });
          this.dataSource.data = response.data;
        } else {
          this.dataSource.data = [];
        }

      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  get timezoneControl() {
    return this.timezoneForm.get('timezone');
  }

  get intervalControl() {
    return this.timezoneForm.get('interval');
  }

  onSubmit() {
    this.submitted = true;
    if (this.timezoneForm.valid && this.dataSource.data.length !== 0) {
      this.spinner = true;
      this.spinnerShow = 'text-trasparent';
      this.submitted = false;
      this.submitButtonDisabled = true;
      this.service.updateSchudle(this.timezoneForm.value).subscribe(
        (response: any) => {
          // this.toastr.success(response.msg);
          console.log("res", response);
          this.getSchudleByCompanyId();
          this.dialog.closeAll();
          this.spinner = false;
          this.submitButtonDisabled = false;
          this.spinnerShow = '';
        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false;
          this.spinnerShow = '';
          this.submitButtonDisabled = false;
        }
      );
    } else if (this.timezoneForm.valid && this.dataSource.data.length == 0) {
      this.spinner = true;
      this.spinnerShow = 'text-trasparent';
      this.submitted = false;
      this.submitButtonDisabled = true;
      this.service.createScheudle(this.timezoneForm.value).subscribe(
        (response: any) => {
          // this.toastr.success(response.msg);
          console.log("res", response);
          this.getSchudleByCompanyId();
          this.dialog.closeAll();
          this.spinner = false;

          this.spinnerShow = '';
          this.submitButtonDisabled = false;
        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false;
          this.submitButtonDisabled = false;

          this.spinnerShow = '';
        }
      );
    }
  }

  deleteSchedule() {
    this.service.deleteSchudle(this.timezoneForm.value).subscribe(
      (response: any) => {
        // this.toastr.success(response.msg);
        this.getSchudleByCompanyId();
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  ConfirmDeleteDepartment() {
    const message = `Are you sure you want to delete this record?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data == true) {
        this.deleteSchedule();
      }
    });
  }

}

