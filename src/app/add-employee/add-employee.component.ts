import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { Subject } from 'rxjs';
import { Logger } from '../@shared/logger.service';
import { AppService } from './../app.service';
import { MatDialogRef } from '@angular/material/dialog';
import {EmployeeService} from 'src/app/employee.service';
const log = new Logger('AddEmployee');
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  isLoading = false;
  submitted = false;
  spinner:boolean = false;
  addEmployeeForm!: FormGroup;
  role: string = '';
  companyData: any;
  spinnerShow: string = '';
  isCompanyLoggedIn: boolean = false;
  noOfEmployees: any
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
    public dialogRef: MatDialogRef<AddEmployeeComponent> ,
    private employeeService: EmployeeService
  ) { }
  companyName: any
  name: any
  ngOnInit(): void {
    this.selectedCompanyId = JSON.parse(localStorage.getItem('comapnyId'));
    this.noOfEmployees = JSON.parse(localStorage.getItem('employees'));
    this.role = this.service.getRole();
    this.companyName = JSON.parse(localStorage.getItem('nameOfCompany'));
    this.name = JSON.parse(localStorage.getItem('companyName'));
    this.initializeForm();
    this.getAllLocation();
    this.getAllShift();
    this.getDepaetmentById();
    this.getAllEmployee();
    if (this.role != 'SA') {
      this.isCompanyLoggedIn = true;
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          // name: this.service.getComapnyName(),
          name: this.companyName ? this.companyName : this.name,
        },
      ];
      this.addEmployeeForm.patchValue({
        company_id: this.service.getCompanyId(),
      });
      this.selectedCompanyId = this.service.getCompanyId();
      this.shiftUser();
    } else {
      this.getAllCompany();
      this.getAllDepartment();
    }
    this.getOfficeLocation();
  }

  initializeForm() {
    this.addEmployeeForm = this.fb.group({
      company_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // employee_id:['', [Validators.required]],
      firstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
      ],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      hourlyRate: ['', [Validators.required]],
      overTime: ['', [Validators.required]],
      // shifts1: ['', [Validators.required]],
      // shifts2: [''],
      // shifts3: [''],
      shifts: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      location_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      type: ['', Validators.required],
    });
  }

  get shiftName() {
    return this.addEmployeeForm.get('shifts');
  }
  getDepaetmentById() {
    this.service.getDepartmentById(this.selectedCompanyId).subscribe(
      (response: any) => {
        this.departmentData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
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
        console.log("departmentData",this.departmentData);
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  locationData: any;
  getAllLocation() {
    this.service.getAllLocation().subscribe(
      (response: any) => {
        this.locationData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  ShiftData: [];
  getAllShift() {
    this.service.getAllShift().subscribe(
      (response: any) => {
        this.ShiftData = response.data;
        if (this.role !== 'SA') {
          this.matchingShifts = this.ShiftData.filter(
            (x: any) => x.company_id === parseInt(this.selectedCompanyId)
          );
        }
      },
      (error) => {
        this.service.handleError(error);
      }
    );

  }

  shiftUser() {

  }

  matchingShifts: any;
  selectedCompanyId: any;
  onCompanySelect(event: any) {
    this.matchingShifts = [];
    this.selectedCompanyId = event.target.value;
    this.matchingShifts = this.ShiftData.filter(
      (x: any) => x.company_id === parseInt(this.selectedCompanyId)
    );
    this.getOfficeLocation();
    this.getDepaetmentById();

  }

  selectedShift1: number;
  selectedShift2: number;
  selectedShift3: number;
  locations: any = [];

  getOfficeLocation() {
    if (this.role === 'SA') {
      this.service
        .getCompanyOfficeLocation(this.selectedCompanyId)
        .subscribe((response: any) => {
          this.locations = response.data
        },
          (error) => {
            this.service.handleError(error);
            this.locations = []
          }
        );
    } else {
      this.service
        .getCompanyOfficeLocation(this.companyData[0].id)
        .subscribe((response: any) => {
          this.locations = response.data
        },
          (error) => {
            this.service.handleError(error);
            this.locations = []
          }
        );
    }

  }

  changeShift1(e: any) {
    this.selectedShift1 = parseInt(e.target.value);
  }

  changeShift2(e: any) {
    this.selectedShift2 = parseInt(e.target.value);
  }

  changeShift3(e: any) { }

  get addEmployeeFormControl() {
    return this.addEmployeeForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/employee']);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  employeeLength: any
  getAllEmployee() {
    if (this.role == 'SA') {
      this.service.getAllEmployee().subscribe(
        (response: any) => {
          this.employeeLength = response.data.length;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    } else {
      this.service.getAllEmployeeByCompany().subscribe(
        (response: any) => {
          // this.allEmployee = response.data;
          this.employeeLength = response.data.length;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }

  shifts: (number | string)[] = ["", "", ""];
  updateShift(index: number, shiftId: number) {
    this.shifts[index] = this.shifts[index] === shiftId ? "" : shiftId;
    console.log("shiftsshifts",this.shifts);
  }

  shouldShowError(): boolean {
    return this.shifts.every(shift => shift === null || shift === undefined || shift === "");
  }
  
  
  addEmployee() {
    this.submitted = true;
    // if (this.role != 'SA') {
    //   const companyId = this.service.getCompanyId();
    //   this.addEmployeeForm.get('companyId').setValue(companyId);
    // }
    if (this.role !== 'SA' && this.noOfEmployees > this.employeeLength) {
      if (this.addEmployeeForm.valid) {
       this.spinner = true
       this.spinnerShow = 'text-trasparent';
        this.submitted = false;
        this.service.addEmployee(this.addEmployeeForm.value,this.shifts).subscribe(
          (response: any) => {
            if (response.data) {
              this.toastr.success(response.msg);
              this.addEmployeeForm.reset();
              this.dialogRef.close();
              this.employeeService.getAllEmployee();
              this.spinner = false;
              this.spinnerShow = '';
              // this.router.navigate(['/dashboard/employee']);
            }
          },
          (error) => {
            if(error.status== 409){
              this.toastr.error(error.error.msg);
              this.spinner = false;
            }else{
              this.toastr.error("Intenal Server error");
              this.spinner = false;
            }
            this.service.handleError(error);
            this.spinner = false;
          }
        );
      }
    } else if (this.role == 'SA') {
      if (this.addEmployeeForm.valid) {
        // this.spinner = true
        this.submitted = false;
        this.service.addEmployee(this.addEmployeeForm.value,this.shifts).subscribe(
          (response: any) => {
            if (response.data) {
              // this.toastr.success(response.msg);
              this.addEmployeeForm.reset();
              // this.router.navigate(['/dashboard/employee']);
              // this.spinner = false;
            }
          },
          (error) => {
            // this.service.handleError(error);
            // this.spinner = false;
          }
        );
      }
    } else {
      // this.toastr.error("Please Upgrade Your Plan to add more employees");

    }
  }
  onCancel(): void {
    // Close the dialog when Cancel button is clicked
    this.dialogRef.close();
  }



}
