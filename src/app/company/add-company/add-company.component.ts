import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { finalize, Subject } from 'rxjs';
import { Logger } from '../../@shared/logger.service';
import { AppService } from '../../app.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddDepartmentComponent } from 'src/app/department/add-department/add-department.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from 'src/app/company.service';
const log = new Logger('AddEmployee');
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  isLoading = false;
  spinnerShow: string = '';
  spinner: boolean = false;
  addCompanyForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
    private companyService:CompanyService,
    public dialogRef: MatDialogRef<AddCompanyComponent>,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }


  // companyData:any
  // getAllCompany() {
  //   this.service.getAllCompany().subscribe(
  //     (response: any) => {
  //       this.companyData = response.data;
  //       // this.dataSource.data = this.companyData;
  //     },
  //     (error) => {
  //       this.service.handleError(error);
  //     }
  //   );
  // }


  submitted = false;
  initializeForm() {
    this.addCompanyForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get shiftName() {
    return this.addCompanyForm.get('shifts');
  }

  changeShift(e: any) {}
  get addCompanyFormControl() {
    return this.addCompanyForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/company']);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  addCompany() {
    this.submitted = true;
    if (this.addCompanyForm.valid) {
      this.spinnerShow = 'text-trasparent';
      this.spinner = true
      this.submitted = false;
      this.service.addCompany(this.addCompanyForm.value).subscribe(
        (response: any) => {
          // this.toastr.success(response.msg);
          // this.router.navigate(['/dashboard/company']);
          this.dialogRef.close();
          this.spinner = false;
          this.spinnerShow = '';
          this.companyService.getAllCompany();

        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false;
          this.spinnerShow = '';
        }
      );
    }
  }
  onCancel(): void {
    // Close the dialog when Cancel button is clicked
    this.dialogRef.close();
  }


  
}
