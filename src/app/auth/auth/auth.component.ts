import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CredentialsService } from '../credentials.service';
import { Logger } from '../../@shared/logger.service';
import { LoaderService } from 'src/app/@shared/pipes';
const log = new Logger("Login");
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  // loginForm: FormGroup;
  // loginForm!: FormGroup;
  public showPassword: boolean;
  routType: number;
  constructor(
    injector: Injector,
    private router: Router, private loader: LoaderService, private route: ActivatedRoute, private toastr: ToastrService, private credentialsService: CredentialsService, private fb: FormBuilder,
    private service: AppService
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.routType = +params.get('type');
    });
  }

  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if (this.token) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  submitted = false
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^.{8,}$/)]),
  });
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  // initializeForm() {
  //   this.loginForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //     remember: true,
  //   });
  // }
  // get addLoginFormControl() {
  //   return this.loginForm.controls;
  // }
  get shiftName() {
    return this.loginForm.get('shifts');
  }
  get loginFormControl() {
    return this.loginForm.controls;
  }
  token: any
  spinner: boolean = false
  spinnerShow: string = '';
  login() {
    this.submitted = true
    if (this.loginForm.valid) {
      this.spinnerShow = 'text-trasparent';
      this.spinner = true
      this.submitted = false
      this.service.login(this.loginForm.value).subscribe((response: any) => {
        if (response.success) {
          this.spinner = false
          this.spinnerShow = '';
          this.token = response.data.access_token;
          localStorage.setItem('loginToken', JSON.stringify(this.token));
          localStorage.setItem('role', JSON.stringify(response.data.role));
          localStorage.setItem('companyName', JSON.stringify(response.data.name));
          localStorage.setItem('employees', response.data.employee);
          localStorage.setItem('nameOfCompany', JSON.stringify(response.data.company_name));
          localStorage.setItem('comapnyId', JSON.stringify(response.data.company_id));
          localStorage.setItem('email', JSON.stringify(response.data.email));
          // this.toastr.success(response.msg);
          this.router.navigateByUrl('/dashboard');
        }
      },
        error => {
          this.service.handleError(error);
          this.spinner = false
          this.spinnerShow = '';

        }
      );
    }
  }
  // register(){
  //    this.router.navigate(['register']);
  // }
}
