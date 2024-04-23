import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  submitted = false;
  comapnyId: any;
  timezoneForm: FormGroup;
  timezones: string[] = moment.tz.names();
  intervals = ['1 day', '1 week'];
  scheduleData: any; // Variable to store schedule data

  constructor(private fb: FormBuilder,
    private service: AppService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
    this.scheduleData = JSON.parse(localStorage.getItem('SchudleGetData'));
    this.timezoneForm = this.fb.group({
      id:[''],
      timezone: ['', Validators.required],
      interval: ['', Validators.required]
    });
    this.getSchudleByCompanyId();
  }

  getSchudleByCompanyId() {
    this.service.getSchudle(this.comapnyId).subscribe(
      (response: any) => {
        this.scheduleData = response.data[0];
        console.log("scheduleData",this.scheduleData);
        this.timezoneForm.patchValue({
          timezone: this.scheduleData.Timezone,
          interval: this.scheduleData.TimeInterval
        });
        localStorage.setItem('SchudleGetData', JSON.stringify( this.scheduleData));
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
    if (this.timezoneForm.valid && this.scheduleData) {
      this.submitted = false;
      this.service.updateSchudle(this.timezoneForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          console.log("res", response);
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
    else if (this.timezoneForm.valid && !this.scheduleData)
      {
        this.submitted = false;
        this.service.createScheudle(this.timezoneForm.value).subscribe(
          (response: any) => {
            this.toastr.success(response.msg);
            console.log("res", response);
            this.getSchudleByCompanyId();
          },
          (error) => {
            this.service.handleError(error);
          }
        );

      }
      

    }
  }



