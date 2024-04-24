import { ReportComponent } from './report/report.component';
import { ShiftComponent } from './shift/shift.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBulkEmployeeComponent } from './add-bulk-employee/add-bulk-employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthGuard } from './auth/authguard.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditEmpComponent } from './edit-emp/edit-emp.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { EmployeeComponent } from './employee/employee.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RemoveBulkEmployeeComponent } from './remove-bulk-employee/remove-bulk-employee.component';
import { CompanyComponent } from './company/company/company.component';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { LocationComponent } from './location/location/location.component';
import { AddLocationComponent } from './location/add-location/add-location.component';
import { EditLocationComponent } from './location/edit-location/edit-location.component';
import { DepartmentComponent } from './department/department/department.component';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { EditDepartmentComponent } from './department/edit-department/edit-department.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportFilterComponent } from './report/report-filter/report-filter.component';
import {SettingComponent} from './setting/setting.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: AuthComponent },
  { path: '', component: AuthComponent },
  {
    path: 'dashboard',   component: DashboardComponent, children: [
    { path: '',          component: HomeComponent },
    { path: 'add-shift', component: AddShiftComponent },
    { path: 'edit-shift/:id', component: EditShiftComponent },
    { path: 'employee',  component: EmployeeComponent },
    { path: 'shift',     component: ShiftComponent },
    { path: 'report',    component: ReportComponent },
    { path: 'reportFilter',    component: ReportFilterComponent },
    { path: 'profile',    component: ProfileComponent },
    { path: 'add-employee', component: AddEmployeeComponent },
    { path: 'edit-employee/:employeeId', component: EditEmpComponent },
    { path: 'addBulk-employee', component: AddBulkEmployeeComponent },
    { path:'removeBulk-employee', component:RemoveBulkEmployeeComponent},
    { path:'company',     component:CompanyComponent},
    { path:'add-company', component:AddCompanyComponent},
    { path:'edit-company/:companyId', component:EditCompanyComponent},
    { path:'location',    component:LocationComponent},
    { path:'add-location',component:AddLocationComponent},
    { path:'edit-location/:locationId', component:EditLocationComponent},
    { path:'department',  component:DepartmentComponent},
    { path:'add-department', component:AddDepartmentComponent},
    { path:'setting', component:SettingComponent},
    { path:'edit-department/:departmentId/:departmentName', component:EditDepartmentComponent},
    ]
  },
  { path:'forgot-password', component:ForgotPasswordComponent},
  { path:'reset-password', component:ResetPasswordComponent},
  { path: "**", component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
