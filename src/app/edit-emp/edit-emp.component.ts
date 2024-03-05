import { AppService } from './../app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './../@shared/pipes/loader.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
@Component({
  selector: 'app-edit-emp',
  templateUrl: './edit-emp.component.html',
  styleUrls: ['./edit-emp.component.scss'],
})
export class EditEmpComponent implements OnInit {
  employeeId!: number;
  editEmployeeForm!: FormGroup;
  submitted = false;
  shiftsName: any = ['[2,3]', '[3,4]', '[4,5]', '[5,6]', '[7,8]', '[8,9]'];
  constructor(
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private toastr: ToastrService
  ) {}

  isCompanyLoggedIn: boolean = false;
  role: any;
  selectedCompanyId: any;
  ngOnInit(): void {
    this.role = this.service.getRole();
    this.isCompanyLoggedIn = this.role == 'SA' ? false : true;
    this.employeeId = this.route.snapshot.params['employeeId'];
    this.initializeForm();
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
  }

  initializeForm() {
    this.editEmployeeForm = this.fb.group({
      companyId: ['', [Validators.required]],
      firstName: [ '',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      hourlyRate : [''],
      overTime: [''],
      shifts1: ['', [Validators.required]],
      shifts2: [''],
      shifts3: [''],
      type: ['', [Validators.required]],
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
  changeShift3(e: any) {}
  matchshift1: any[] = [];
  matchshift2: any[] = [];
  matchshift3: any[] = [];
  companyId:number
  employeeResponse:any
  getEmployeeById(id: number) {
    this.service.getEmployeeById(id).subscribe({
      next: (response: any) => {
        this.companyId =parseInt(response.data.company.id)
        this.employeeResponse=response
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
            if(this.ShiftData.length > 0 &&this.companyId!==undefined){
              this.matchingShifts = this.ShiftData.filter(
                (x: any) => x.company_id === this.companyId
              );
            }
            let matchingShift1 = this.ShiftData.find(
              (x: any) => x.id ===  this.employeeResponse.data.shift1.id
            );
            this.matchshift1.push(matchingShift1);
            let matchingShift2 = this.ShiftData.find(
              (x: any) => x.id ===  this.employeeResponse.data.shift2.id
            );
            this.matchshift2.push(matchingShift2);
            let matchingShift3 = this.ShiftData.find(
              (x: any) => x.id ===  this.employeeResponse.data.shift3.id
            );
            this.matchshift3.push(matchingShift3);
          }
          (this.selectedShift1 = this.matchshift1[0] == undefined ? null : this.matchshift1[0].id),
            (this.selectedShift2 = this.matchshift2[0] == undefined ? null : this.matchshift2[0].id),
            this.editEmployeeForm.patchValue({
              companyId:  this.employeeResponse.data.company.id,
              email:  this.employeeResponse.data.email,
              hourlyRate: (this.employeeResponse.data.hourlyRate === null || this.employeeResponse.data.hourlyRate === undefined) ? '' : this.employeeResponse.data.hourlyRate,
              overTime: (this.employeeResponse.data.overTime === null || this.employeeResponse.data.overTime === undefined) ? '' : this.employeeResponse.data.overTime,
              type: (this.employeeResponse.data.type === null || this.employeeResponse.data.type === undefined) ? '' : this.employeeResponse.data.type,
              firstName: firstName,
              lastName: lastName,
              shifts1: this.matchshift1[0] == undefined ? null: this.matchshift1[0].id,
              shifts2: this.matchshift2[0] == undefined ? null: this.matchshift2[0].id,
              shifts3: this.matchshift3[0] == undefined ? null: this.matchshift3[0].id,
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

  editEmployee() {
    this.submitted = true;
    if (this.editEmployeeForm.valid) {
      this.submitted = false;
      this.service.updateEmployee(this.editEmployeeForm.value, this.employeeId).subscribe((response: any) => {
          if ((response as any).success == true) {
            this.toastr.success((response as any).msg);
            this.editEmployeeForm.reset();
            this.router.navigate(['/dashboard/employee']);
          }
        });
    }
  }
  getByUserId(employeeId: number) {}
}
