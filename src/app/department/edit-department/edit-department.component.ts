import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { ValidateAllFormFields } from '../../@shared/helpers/validate-form-fields';
import { untilDestroyed } from '../../@shared/pipes/until-destroyed';
import { finalize, Subject } from 'rxjs';
import { Logger } from '../../@shared/logger.service';
import { AppService } from '../../app.service';
import { MatDialogRef,MAT_DIALOG_DATA, } from '@angular/material/dialog';
import {DepartmentService} from 'src/app/department.service';
const log = new Logger('AddEmployee');
@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss'],
})
export class EditDepartmentComponent implements OnInit {
  // getDepartmentById();
  spinner : boolean = false
  isLoading = false;
  department_name: string;
  location_id:number;
  comapnyId:any
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
    private service: AppService,
    public dialogRef: MatDialogRef<EditDepartmentComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any,
    private departmentService: DepartmentService
  ) {}

  departmentId: any;
  departmentName: any;

  ngOnInit(): void {
    this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
    this.department_name = this.data.row.department_name;
    this.location_id = this.data.row.location_id;
    this.departmentId=this.data.row.department_id;
    // this.departmentId=this.data.departmentId;
    // this.departmentName=this.data.departmentName;
    // this.getDepartmentById(this.departmentId);
    this.initializeForm();
    this.getLocationByCompanyId();
  }

  initializeForm() {
    this.editDepartmentForm = this.fb.group({
      department: ['', [Validators.required]],
      location_id:['',[Validators.required]]
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

  // getDepartmentById(id: number) {
  //   this.service.getDepartmentById(id).subscribe({
  //     next: (response: any) => {
  //       // if (response.data) {
  //       //   this.editDepartmentForm.patchValue({
  //       //     department: response.data.department_name,
  //       //   });
  //       // }
  //       console.log("responce",response);
  //     },
  //   });
  // }

  editDepartment() {
    if (this.editDepartmentForm.valid) {
      this.spinner = true
      this.service
        .editDepartment(this.editDepartmentForm.value, this.departmentId)
        .subscribe(
          (response: any) => {
            this.toastr.success(response.msg);
            this.dialogRef.close();
            this.departmentService.getDepartmentById();
            this.spinner = false
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

  
  locationData:any=[]

  getLocationByCompanyId() {
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
