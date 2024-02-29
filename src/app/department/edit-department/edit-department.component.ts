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
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss'],
})
export class EditDepartmentComponent implements OnInit {
  // getDepartmentById();

  isLoading = false;
  editDepartmentForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private appService: AppService,
    private credentialsService: CredentialsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService
  ) {}

  departmentId: any;
  departmentName: any;
  ngOnInit(): void {
    this.departmentId = this.route.snapshot.params['departmentId'];
    this.departmentName = this.route.snapshot.params['departmentName'];
    this.getDepartmentById(this.departmentId);
    this.initializeForm();
  }

  initializeForm() {
    this.editDepartmentForm = this.fb.group({
      department: ['', [Validators.required]],
    });
  }
  get shiftName() {
    return this.editDepartmentForm.get('shifts');
  }

  changeShift(e: any) {}
  get editDepartmentFormControl() {
    return this.editDepartmentForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/department']);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getDepartmentById(id: number) {
    this.service.getDepartmentById(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.editDepartmentForm.patchValue({
            department: response.data.department_name,
          });
        }
      },
    });
  }

  editDepartment() {
    if (this.editDepartmentForm.valid) {
      this.service
        .editDepartment(this.editDepartmentForm.value, this.departmentId)
        .subscribe(
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
