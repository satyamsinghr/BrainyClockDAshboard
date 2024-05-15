import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { AppService } from '../../app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  spinner: boolean = false;
  spinnerShow: string = '';
  submitted: boolean = false; // Add this line

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, // Inject Router
    private service: AppService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.submitted = true; 
    if (this.forgotPasswordForm.valid) {
      this.spinner = true;
      this.spinnerShow = 'text-trasparent';
      const email = this.forgotPasswordForm.value.email;
      this.service.forgotPassword(email).subscribe(
        (response: any) => {
          this.router.navigate(['/reset-password']); 
          this.spinner = false;
          this.spinnerShow = '';
        },
        (error: any) => {
          console.error('Error:', error);
          this.spinner = false;
          this.spinnerShow = '';
        }
      );
    }
  }
}
