import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit ,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { Subject } from 'rxjs';
import { AppService } from '../../app.service';
import { Location } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import {DepartmentComponent} from '../department/department.component'
import {DepartmentService} from 'src/app/department.service';
@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit {
  spinner : boolean = false
  isLoading = false;
  isCompanyLoggedIn: boolean = false;
  submitted = false;
  companyData:any;
  role:any
  companyName:any
  comapnyId:any
  addDepartmentForm!: FormGroup;
  locationData:any=[]
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    // private location: Location,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
     public dialogRef: MatDialogRef<AddDepartmentComponent> ,
    //  @Inject(DepartmentComponent) private departmentComponent: DepartmentComponent 
    private departmentService: DepartmentService
  ) {}
  name:any
  ngOnInit(): void {
    this.role = this.service.getRole();
    this.companyName=JSON.parse(localStorage.getItem('nameOfCompany'));
    this.name=JSON.parse(localStorage.getItem('companyName'));
    this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
    this.initializeForm();
    this.getLocationByCompanyId();
    if (this.role != 'SA') {
      this.isCompanyLoggedIn = true;
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          name: this.companyName?this.companyName:this.name,
        },
      ];
      this.addDepartmentForm.patchValue({
        company_id: this.service.getCompanyId(),
      });
    } else {
      this.getAllCompany();
    }
    // this.departmentService.getAllDepartment();
  }

  initializeForm() {
    this.addDepartmentForm = this.fb.group({
      department: ['', [Validators.required]],
      company_id: ['', [Validators.required]],
      location_id:['',[Validators.required]]
    });
  }

  selectedCompanyId:any
  onCompanySelect(event: any) {
    this.selectedCompanyId = event.target.value;
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

  get shiftName() {
    return this.addDepartmentForm.get('shifts');
  }

  changeShift(e: any) {}
  get addDepartmentFormControl() {
    return this.addDepartmentForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/department']);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  addDepartment() {
    this.submitted = true;
    if (this.addDepartmentForm.valid) {
      this.spinner = true
      this.submitted = false;
      this.service.addDepartment(this.addDepartmentForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          this.dialogRef.close();
          this.departmentService.getDepartmentById();
          this.spinner = false
          // this.location.replaceState(this.location.path());
    
        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false
        }
      );
    }
  }
  onCancel(): void {
    // Close the dialog when Cancel button is clicked
    this.dialogRef.close();
  }



  getLocationByCompanyId() {
    debugger
    this.service.getLocationByCompany(this.comapnyId).subscribe(
      (response: any) => {
        this.locationData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  
}
