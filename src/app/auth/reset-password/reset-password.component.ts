import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  public showPassword: boolean;
  submitted = false;
  spinner = false;
  spinnerShow: string = '';
  constructor(private formBuilder: FormBuilder,private service:AppService,private toastr: ToastrService,private router:Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmationCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/)]]
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetPasswordForm.valid) {
      this.spinner = true;
      this.spinnerShow = 'text-trasparent';
      this.service.resetPassword(this.resetPasswordForm.value).subscribe(
        (response:any) => {
          console.log('Password reset successfully:', response);
          this.toastr.success(response.msg);
          this.router.navigate(['/']); 
          this.spinner = false;
          this.spinnerShow = '';
        },
        (error:any) => {
          console.error('Error resetting password:', error);
          this.spinner = false;
          this.spinnerShow = '';
        }
      )
    }
}

  
}

