import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { ValidateAllFormFields } from '../../@shared/helpers/validate-form-fields';
import { untilDestroyed } from '../../@shared/pipes/until-destroyed';
import { finalize, Subject } from 'rxjs';
import { Logger } from '../../@shared/logger.service';
import { AppService } from '../../app.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from 'src/app/company.service';
const log = new Logger('AddEmployee');
@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss'],
})
export class EditCompanyComponent implements OnInit {
  isLoading = false;
  editCompanyForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
    private companyService:CompanyService,
    public dialogRef: MatDialogRef<EditCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {}
  companyId: any;
  company_id:number;
  name:string;
  spinnerShow: string = '';
  spinner: boolean = false;
  email:string
  ngOnInit(): void {
    this.name=this.data.row.name;
    this.company_id=this.data.row.id;
    this.email=this.data.row.email;
    this.companyId = this.route.snapshot.params['companyId'];
    // this.getcompanyById(this.companyId);
    this.initializeForm();
  }
  submitted = false;
  initializeForm() {
    this.editCompanyForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get shiftName() {
    return this.editCompanyForm.get('shifts');
  }

  changeShift(e: any) {}
  get editCompanyFormControl() {
    return this.editCompanyForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/employee']);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getcompanyById(id: number) {
    this.service.getCompanyById(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.editCompanyForm.patchValue({
            email: response.data.email,
            name: response.data.name,
          });
        }
      },
    });
  }

  editCompany() {
    this.submitted = true;
    if (this.editCompanyForm.valid) {
      this.spinnerShow = 'text-trasparent';
      this.spinner = true
      this.submitted = false;
      this.service
        .editCompany(this.editCompanyForm.value, this.company_id)
        .subscribe(
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
