import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CredentialsService } from '../credentials.service';
import { LoaderService } from 'src/app/@shared/pipes';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public showPassword: boolean;
  routType: number;
  submitted = false
  constructor(
    injector:Injector,
    private router: Router, private loader: LoaderService,private route: ActivatedRoute, private toastr:ToastrService, private credentialsService: CredentialsService,  private fb: FormBuilder,
    private service:AppService
    ) { 
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.routType = +params.get('type');
      });
  }

  ngOnInit(): void {
  }
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,Validators.email]),
    // password: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]],
    password: new FormControl('', [Validators.required , Validators.pattern(/^.{8,}$/)]),
  });
  get shiftName() {
    return this.registerForm.get('shifts');
  }
  get registerFormControl() {
    return this.registerForm.controls;
  }
  register() {
    this.submitted = true
    if (this.registerForm.valid) {
      this.submitted = false
     this.service.register(this.registerForm.value).subscribe((response:any) => {
      this.toastr.success(response.msg);
      this.router.navigateByUrl('/login');
     },
     error => {
      this.service.handleError(error);
    });
    }
}

// login(){
//   // this.router.navigate(['login']);
// }
}
