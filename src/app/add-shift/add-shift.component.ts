import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss'],
})
export class AddShiftComponent implements OnInit {
  addShiftForm!: FormGroup;
  dayName: any = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedDay: string = '';
  role: string = '';
  isCompanyLoggedIn: boolean = false;
  companyData: any;
  locationData: any;
  locationAllData: any;
  companyId: any;
  companyName: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService
  ) {}
  name:any
  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('comapnyId'));
    this.companyName=JSON.parse(localStorage.getItem('nameOfCompany'));
    this.name=JSON.parse(localStorage.getItem('companyName'));
    this.initializeForm();
    this.role = this.service.getRole();
    this.getAllLocation();
   
    if (this.role != 'SA') {
      this.getDepaetmentById();
      this.getLocation();
      this.isCompanyLoggedIn = true;
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          // name: this.service.getComapnyName(),
         
          name: this.companyName ? this.companyName : this.name,
        },
      ];
      this.addShiftForm.patchValue({
        companyId: this.service.getCompanyId(),
      });
    } else {
      this.getAllCompany();
    // this.getAllDepartment();
    }
  }

  getDepaetmentById(){
    this.companyId = this.role == 'SA' ? this.selectedCompanyId : this.companyId
    if(this.companyId){
      this.service.getDepartmentById(this.companyId).subscribe(
        (response: any) => {
           this.departmentData = response;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
    else{
      this.departmentData = []
    }
  }

  submitted = false;
  initializeForm() {
    this.addShiftForm = this.fb.group({
      department_id: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      clockInTime: ['', [Validators.required]],
      clockOutTime: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
    });
  }

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
  changeDays(e: any) {}
  get daysName() {
    return this.addShiftForm.get('days');
  }
  get addShiftFormControl() {
    return this.addShiftForm.controls;
  }
  gotoViewShiftPage() {
    this.router.navigate(['/dashboard/shift']);
  }
  matchingShifts: any;
  selectedCompanyId: string;
  onCompanySelect(event: any) {
    this.matchingShifts = [];
    this.selectedCompanyId = event.target.value;
    this.matchingShifts = this.locationAllData.filter(
      (x: any) => x.company_id === parseInt(this.selectedCompanyId)
    );
    this.getLocation();
    this.getDepaetmentById();
  }
  getAllLocation(){
    this.service.getAllLocation().subscribe(
        (response: any) => {
          this.locationAllData = response.data;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
  }
  getLocation() {
    if(this.role=='SA'){
      this.service
      .getCompanyOfficeLocation(parseInt(this.selectedCompanyId))
      .subscribe((response: any) => {
        this.locationData = response.data
      },
      (error) => {
        this.service.handleError(error);
        this.locationData = []
      }
      );
    }else{
      this.service
      .getCompanyOfficeLocation(this.companyId)
      .subscribe((response: any) => {
        this.locationData = response.data
      },
      (error) => {
        this.service.handleError(error);
        this.locationData = []
      }
      );
    }
 
  }

  selectedDays: string[] = []; 

  toggleDaySelection(day: string) {
    const index = this.selectedDays.indexOf(day);
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day); 
    }
  }

  addShift() {
    this.submitted = true;
    if (this.role != 'SA') {
      const companyId = this.service.getCompanyId();
      this.addShiftForm.get('companyId').setValue(companyId);
    }
    if (this.addShiftForm.valid) {
      this.submitted = false;
      this.service.addShift(this.addShiftForm.value,this.selectedDays).subscribe(
        (response: any) => {
          if (response.success == true) {
            this.toastr.success(response.msg);
            this.router.navigate(['/dashboard/shift']);
          }
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }
  back_to_shift(){
    this.router.navigate(['/dashboard/shift']);
  }
}
