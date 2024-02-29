import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { Subject } from 'rxjs';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit {
  isLoading = false;
  isCompanyLoggedIn: boolean = false;
  submitted = false;
  companyData:any;
  role:any
  companyName:any
  addDepartmentForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService
  ) {}
  name:any
  ngOnInit(): void {
    this.role = this.service.getRole();
    this.companyName=JSON.parse(localStorage.getItem('nameOfCompany'));
    this.name=JSON.parse(localStorage.getItem('companyName'));
    this.initializeForm();
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
  }

  initializeForm() {
    this.addDepartmentForm = this.fb.group({
      department: ['', [Validators.required]],
      company_id: ['', [Validators.required]],
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
      this.submitted = false;
      this.service.addDepartment(this.addDepartmentForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          this.router.navigate(['/dashboard/department']);
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }
  
}
