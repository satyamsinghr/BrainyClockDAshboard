import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { finalize, Subject } from 'rxjs';
import { Logger } from '../../@shared/logger.service';
import { AppService } from '../../app.service';
const log = new Logger('AddEmployee');
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  isLoading = false;
  addCompanyForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

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
      this.submitted = false;
      this.service.addCompany(this.addCompanyForm.value).subscribe(
        (response: any) => {
          // this.toastr.success(response.msg);
          this.router.navigate(['/dashboard/company']);
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }
  
}
