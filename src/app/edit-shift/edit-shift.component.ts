import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '../auth/credentials.service';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: ['./edit-shift.component.scss'],
})
export class EditShiftComponent implements OnInit {
  editShiftForm!: FormGroup;

  dayName: any = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  id: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private fb: FormBuilder,
    private service: AppService,
    private toastr: ToastrService
  ) {}
  submitted = false;
  disableSelect: boolean = true;
  role: any;
  isCompanyLoggedIn: boolean = false;
  ngOnInit(): void {
    this.role = this.service.getRole();
    this.initializeForm();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getFormDetail(this.id);
      // this.getAllCompany();
      // this.getAllDepartment();
    });
    if (this.role != 'SA') {
      this.isCompanyLoggedIn = true;
      //this.addShiftForm.get('companyId').disable();
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          name: this.service.getComapnyName(),
        },
      ];
      this.editShiftForm.patchValue({
        companyId: this.service.getCompanyId(),
      });
    } else {
      this.getAllCompany();
    }
  }

  getFormDetail(id: number) {
    this.service.getShiftById(id).subscribe({
      next: (response: any) => {
        let days = [];
        if (response.data.days.includes(',')) {
          days = response.data.days.split(',');
        } else {
          days.push(response.data.days);
        }
        if (response.success) {
          this.editShiftForm.patchValue({
            companyId: response.data.company_id,
            department_id: response.data.department_id,
            name: response.data.name,
            days: days,
            clockInTime: response.data.clock_in_time,
            clockOutTime: response.data.clock_out_time,
            lunchInTime: response.data.lunch_in_time,
            lunchOutTime: response.data.lunch_out_time,
          });
        }
        this.companyId = response.data.company_id
        this.onSelectCompany('')
      },
      error: (error) => {
        this.service.handleError(error);
      },
      complete: () => {},
    });
  }

  initializeForm() {
    this.editShiftForm = this.fb.group({
      companyId: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      days: ['', [Validators.required]],
      clockInTime: ['', [Validators.required]],
      clockOutTime: ['', [Validators.required]],
      // lunchInTime: ['', [Validators.required]],
      // lunchOutTime: ['', [Validators.required]],
    });
  }

  companyData: any;
  getAllCompany() {
    this.service.getAllCompany().subscribe(
      (response: any) => {
        this.companyData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  departmentData: any;
  getAllDepartment() {
    this.service.getAllDepartment().subscribe(
      (response: any) => {
        this.departmentData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  companyId:any
  onSelectCompany(event:any){
    this.companyId  = event == "" ? this.companyId : event.target.value
        this.service.getDepartmentById(this.companyId).subscribe(
          (response: any) => {
             this.departmentData = response.data;
          },
          (error) => {
            this.service.handleError(error);
          }
        );
      }

  changeDays(e: any) {}
  get daysName() {
    return this.editShiftForm.get('days');
  }
  get editShiftFormControl() {
    return this.editShiftForm.controls;
  }
  gotoViewShiftPage() {
    this.router.navigate(['/dashboard/shift']);
  }
  editShift() {
    this.submitted = true;
    if (this.editShiftForm.valid) {
      this.submitted = false;
      this.service
        .updateShift(this.editShiftForm.value, this.id)
        .subscribe((response) => {
          if ((response as any).success == true) {
            this.toastr.success((response as any).msg);
            this.router.navigate(['/dashboard/shift']);
          }
        });
    }
  }
}
