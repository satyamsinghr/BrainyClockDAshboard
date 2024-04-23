import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MatTableDataSource } from '@angular/material/table';
import { viewEmployeeItemDto }    from './../@shared/models/viewEmployee.model';
import { Emp_Data } from '../@shared/models/dataSource';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  submitted = false;
  spinner : boolean = false;
  comapnyId: any;
  timezoneForm: FormGroup;
  showTimeZoneFormFlag:boolean= false
  timezones: string[] = moment.tz.names();
  intervals = ['1 day', '1 week'];
  submitButtonDisabled: boolean = false;

  scheduleData: any = []; 
  // createSchudleData : any = []
  @ViewChild('timezoneFormData') timezoneFormData: any;
  
  dataSource = new MatTableDataSource(this.scheduleData);
  // dataSource = new MatTableDataSource<viewEmployeeItemDto>(Emp_Data);
  displayedColumns: string[] = ['timezone', 'interval', 'edit',];
  constructor(private fb: FormBuilder,
    private service: AppService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    // public dialogRef: MatDialogRef<SettingComponent> ,
  ) {}


  ngOnInit() {
    this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
    // this.scheduleData = JSON.parse(localStorage.getItem('SchudleGetData'));
    this.timezoneForm = this.fb.group({
      id:[''],
      companyId:[],
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
      width: '100%', maxWidth: '420px' ,
    }); 
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit department modal was closed');
    });
    
  }  
  getSchudleByCompanyId() {
    debugger
    this.service.getSchudle(this.comapnyId).subscribe(
      (response: any) => {
        this.scheduleData = response.data[0];
        console.log("scheduleData",this.scheduleData);
        if(this.scheduleData){
        this.timezoneForm.patchValue({
          id:this.scheduleData.Id,  
          companyId:this.scheduleData.CompanyId,
          timezone: this.scheduleData.Timezone,
          interval: this.scheduleData.TimeInterval
        });
        this.dataSource.data =response.data;
      }else{
        this.dataSource.data =[];
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
      this.submitted = false;
      this.submitButtonDisabled = true; 
      this.service.updateSchudle(this.timezoneForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          console.log("res", response);
          this.getSchudleByCompanyId();
          this.dialog.closeAll();
          this.spinner = false;
          this.submitButtonDisabled = false; 
        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false;
          this.submitButtonDisabled = false; 
        }
      );
    } else if (this.timezoneForm.valid && this.dataSource.data.length == 0) {
      this.spinner = true;
      this.submitted = false;
      this.submitButtonDisabled = true;
      this.service.createScheudle(this.timezoneForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          console.log("res", response);
          this.getSchudleByCompanyId();
          this.dialog.closeAll();
          this.spinner = false;
          this.submitButtonDisabled = false; 
        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false;
          this.submitButtonDisabled = false; 
        }
      );
    }
  }
  
  deleteSchedule() {
    debugger
    this.service.deleteSchudle(this.timezoneForm.value).subscribe(
      (response: any) => {
          this.toastr.success(response.msg);
          this.getSchudleByCompanyId();
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  
}

