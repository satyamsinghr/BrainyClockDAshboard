import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationStart, Router } from '@angular/router';
import { SharedService } from '../shared.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  passwordForm: FormGroup;
  submitted: boolean = false
  email: any
  public showPassword: boolean;
  public newPassword: boolean;
  public confirmPassword: boolean;
  spinner: boolean = false
  spinnerShow: string = '';
  lastUrl: string;
  constructor(
     private service:AppService,
     private fb: FormBuilder,
     private toastr:ToastrService,
     private sharedService:SharedService,
     private router: Router) {}

  ngOnInit(): void {
    const Url  = this.router.url;
    
    const parts = Url.split('/');
    this.lastUrl = parts[parts.length - 1];
    this.sharedService.setLastUrl(this.lastUrl);
    this.email = JSON.parse(localStorage.getItem('email'));
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group({
      currentPassword: ['',[ Validators.required, Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/)]],
      newPassword: ['',  [Validators.required, Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/)]],
      confirmPassword: ['', Validators.required,],
    },
    );
  }

    updatePassword() {
      this.submitted = true
      if (this.passwordForm.valid && (this.passwordForm.controls['confirmPassword'].value === this.passwordForm.controls['newPassword'].value)) {
        this.submitted = false
        this.spinnerShow = 'text-trasparent';
        this.spinner = true
        this.service.updatePassword(this.passwordForm.value, this.email ).subscribe((response:any) => {
        if(response.success){
          // this.toastr.success('Password has been updated successfully');
          this.passwordForm.reset()
          this.spinnerShow = '';
          this.spinner = false;
        }},
        error => {
          this.service.handleError(error);
          this.spinnerShow = '';
          this.spinner = false;
        })
    }

  }
  reset()  {
    this.submitted = false
    this.passwordForm.reset();
  }

  }



