import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { ValidateAllFormFields } from '../../@shared/helpers/validate-form-fields';
import { untilDestroyed } from '../../@shared/pipes/until-destroyed';
import { finalize, Subject } from 'rxjs';
import { Logger } from '../../@shared/logger.service';
import { AppService } from '../../app.service';
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
    private service: AppService
  ) {}
  companyId: any;
  ngOnInit(): void {
    this.companyId = this.route.snapshot.params['companyId'];
    this.getcompanyById(this.companyId);
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
      this.submitted = false;
      this.service
        .editCompany(this.editCompanyForm.value, this.companyId)
        .subscribe(
          (response: any) => {
            this.toastr.success(response.msg);
            this.router.navigate(['/dashboard/company']);
          },
          (error) => {
            this.service.handleError(error);
          }
        );
    }
  }
  
}
