import { AppService } from './../app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './../@shared/pipes/loader.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/employee.service';
@Component({
  selector: 'app-edit-emp',
  templateUrl: './edit-emp.component.html',
  styleUrls: ['./edit-emp.component.scss'],
})
export class EditEmpComponent implements OnInit {
  employeeId!: number;
  editEmployeeForm!: FormGroup;
  submitted = false;
  selectedShifts: number[] = [];
  spinner:boolean = false;
  shiftsName: any = ['[2,3]', '[3,4]', '[4,5]', '[5,6]', '[7,8]', '[8,9]'];
  constructor(
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditEmpComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private employeeService: EmployeeService
  ) { }

  isCompanyLoggedIn: boolean = false;
  role: any;
  selectedCompanyId: any;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hourlyRate: number;
  overTime: number;
  // shifts1: number;
  // shifts2: number;
  // shifts3: number;
  employee_id:string;
  department_id:any;
  department_name:any;
  locations:any ;
  type: number;
  location_name:any;
  ngOnInit(): void {
    this.employeeId = this.data.row.id;
    this.id = this.data.row.id;
    this.firstName = this.data.row.firstName;
    this.lastName = this.data.row.lastName;
    this.email = this.data.row.email;
    this.hourlyRate = this.data.row.hourlyRate;
    this.overTime = this.data.row.overTime;
    // this.employee_id = this.data.row.employee_id;
    this.location_name =this.data.row.location_id;
    // this.type = this.data.row.type;
    this.selectedCompanyId = this.data.row.company_id;
    this.department_name = this.data.row.department_name;
    this.role = this.service.getRole();
    this.isCompanyLoggedIn = this.role == 'SA' ? false : true;
    this.selectedShifts.push(
      this.data.row.shift_id_1 !== null ? this.data.row.shift_id_1 : "",
      this.data.row.shift_id_2 !== null ? this.data.row.shift_id_2 : "",
      this.data.row.shift_id_3 !== null ? this.data.row.shift_id_3 : ""
  );
    console.log("asd",this.selectedShifts)
    // this.employeeId = this.route.snapshot.params['employeeId'];
    this.initializeForm();
    this. getAllDepartment();
    this.getEmployeeById(this.employeeId);
    if (this.role != 'SA') {
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          name: this.service.getComapnyName(),
        },
      ];
      this.editEmployeeForm.patchValue({
        companyId: this.service.getCompanyId(),
      });
      this.companyId = this.service.getCompanyId();
      // this.getAllShift();
      // this.matchingShifts = this.ShiftData.filter(
      //   (x: any) => x.company_id === parseInt(this.selectedCompanyId)
      // );
    } else {
      this.getAllCompany();
    }
    // this.matchingShifts = [];
    // this.matchingShifts.push(this.data.row);
    this.getOfficeLocation();
  }

  // getAllShift() {
  //   this.service.getAllShift().subscribe(
  //     (response: any) => {
  //       this.ShiftData = response.data;
  //       if (this.role !== 'SA') {
  //         this.matchingShifts = this.ShiftData.filter(
  //           (x: any) => x.company_id === parseInt(this.selectedCompanyId)
  //         );
  //       }
  //       this.shifts1 = this.matchingShifts.find((x: { name: any; }) => x.name == this.data.row.shift_name_1).id;
  //       this.shifts2 = this.matchingShifts.find((x: { name: any; }) => x.name == this.data.row.shift_name_2).id;
  //       this.shifts3 = this.matchingShifts.find((x: { name: any; }) => x.name == this.data.row.shift_name_3).id;
        
  //       // this.shifts1 = this.data.row.shift_name_1;
  //       // this.shifts2 = this.data.row.shift_name_2;
  //       // this.shifts3 = this.data.row.shift_name_3;

  //       console.log('tesing gdfdf', { 'selected': this.shifts1, 'arr': this.matchingShifts });

  //     },
  //     (error) => {
  //       this.service.handleError(error);
  //     }
  //   );
  // }
  initializeForm() {
    this.editEmployeeForm = this.fb.group({
      companyId: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      hourlyRate: [''],
      overTime: [''],
      // shifts1: ['', [Validators.required]],
      // shifts2: ['', [Validators.required]],
      // shifts3: ['', [Validators.required]],
      type: ['', [Validators.required]],
      // employee_id: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      location_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

    });
  }
  get shiftName() {
    return this.editEmployeeForm.get('shifts');
  }
  get editEmployeeFormControl() {
    return this.editEmployeeForm.controls;
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

  ShiftData: any = [];
  matchingShifts: any;
  onCompanySelect(event: any) {
    this.matchingShifts = [];
    const selectedCompanyId = event.target.value;
    this.matchingShifts = this.ShiftData.filter(
      (x: any) => x.company_id === parseInt(selectedCompanyId)
    );
    this.editEmployeeForm.get('shifts1').reset('');
    this.editEmployeeForm.get('shifts2').reset('');
    this.editEmployeeForm.get('shifts3').reset('');
    console.log("matches", this.matchingShifts);
  }




  selectedShift1: number;
  selectedShift2: number;
  selectedShift3: number;

  changeShift1(e: any) {
    this.selectedShift1 = parseInt(e.target.value);
  }
  changeShift2(e: any) {
    this.selectedShift2 = parseInt(e.target.value);
  }
  changeShift3(e: any) { }
  matchshift1: any[] = [];
  matchshift2: any[] = [];
  matchshift3: any[] = [];
  companyId: number
  employeeResponse: any
  getEmployeeById(id: number) {
    this.service.getEmployeeById(id).subscribe({
      next: (response: any) => {
        this.companyId = parseInt(response.data.company.id)
        this.employeeResponse = response
        if (response.success) {
          let nameParts = response.data.name.split(' ');
          let firstName = nameParts[0];
          let lastName = nameParts.slice(1).join(' ');
          this.matchshift1 = [];
          this.matchshift2 = [];
          this.matchshift3 = [];

          this.service.getAllShift().subscribe(
            (response: any) => {
              this.ShiftData = response.data;
              if (this.ShiftData.length > 0) {
                if (this.ShiftData.length > 0 && this.companyId !== undefined) {
                  this.matchingShifts = this.ShiftData.filter(
                    (x: any) => x.company_id === this.companyId
                  );
                }
                let matchingShift1 = this.ShiftData.find(
                  (x: any) => x.id === this.employeeResponse.data.shift1.id
                );
                this.matchshift1.push(matchingShift1);
                let matchingShift2 = this.ShiftData.find(
                  (x: any) => x.id === this.employeeResponse.data.shift2.id
                );
                this.matchshift2.push(matchingShift2);
                let matchingShift3 = this.ShiftData.find(
                  (x: any) => x.id === this.employeeResponse.data.shift3.id
                );
                this.matchshift3.push(matchingShift3);
              }
              (this.selectedShift1 = this.matchshift1[0] == undefined ? null : this.matchshift1[0].id),
                (this.selectedShift2 = this.matchshift2[0] == undefined ? null : this.matchshift2[0].id),
                this.editEmployeeForm.patchValue({
                  companyId: this.employeeResponse.data.company.id,
                  email: this.employeeResponse.data.email,
                  hourlyRate: (this.employeeResponse.data.hourlyRate === null || this.employeeResponse.data.hourlyRate === undefined) ? '' : this.employeeResponse.data.hourlyRate,
                  overTime: (this.employeeResponse.data.overTime === null || this.employeeResponse.data.overTime === undefined) ? '' : this.employeeResponse.data.overTime,
                  type: (this.employeeResponse.data.type === null || this.employeeResponse.data.type === undefined) ? '' : this.employeeResponse.data.type,
                  firstName: firstName,
                  lastName: lastName,
                  shifts1: this.matchshift1[0] == undefined ? null : this.matchshift1[0].id,
                  shifts2: this.matchshift2[0] == undefined ? null : this.matchshift2[0].id,
                  shifts3: this.matchshift3[0] == undefined ? null : this.matchshift3[0].id,
                });
            },
            (error) => {
              this.service.handleError(error);
            }
          );
        }
      },
    });
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/employee']);
  }


  getOfficeLocation() {
    if (this.role === 'SA') {
      this.service
        .getCompanyOfficeLocation(this.selectedCompanyId)
        .subscribe((response: any) => {
          this.locations = response.data
          this.location_name = this.locations.find((x: { location_name: any; }) => x.location_name == this.data.row.location_name).id;
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
  editEmployee() {
    this.submitted = true;
    if (this.editEmployeeForm.valid) {
      this.spinner = true;
      this.submitted = false;
      this.service.updateEmployee(this.editEmployeeForm.value, this.id,this.selectedShifts).subscribe((response: any) => {
        if ((response as any).success == true) {
          this.toastr.success((response as any).msg);
          this.editEmployeeForm.reset();
          this.dialogRef.close();
          this.employeeService.getAllEmployee();
          this.spinner = false;
          // this.router.navigate(['/dashboard/employee']);
        }
      });
    }
  }
  getByUserId(employeeId: number) { }


  onCancel(): void {
    // Close the dialog when Cancel button is clicked
    this.dialogRef.close();
  }

  departmentData: any;
  getAllDepartment() {
    this.service.getAllDepartment().subscribe(
      (response: any) => {
        this.departmentData = response.data;
        this.department_name = this.departmentData.find((x: { department_name: any; }) => x.department_name == this.data.row.department_name).id;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  // Toggle selection of a shift
  toggleShiftSelection(shiftId: number): void {
    console.log("before",this.isShiftSelected);
    const index = this.selectedShifts.indexOf(shiftId);
    if (index === -1) {
      // Shift not selected, add it to the list
      this.selectedShifts.push(shiftId);
    } else {
      // Shift already selected, remove it from the list
      this.selectedShifts.splice(index, 1);
    }
    console.log("after",this.isShiftSelected)
  }
  isShiftSelected(shiftId: number): boolean {
    return this.selectedShifts.includes(shiftId);
  }
  getSelectedShiftsArray(): string[] {
    return this.selectedShifts.map(shiftId => shiftId.toString());
  }

  
}
