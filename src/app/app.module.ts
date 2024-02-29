import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMaterialModule } from './main-material/main-material.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoaderComponent } from './@shared/loader/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotfoundComponent } from './notfound/notfound.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ToastrModule } from 'ngx-toastr';
import { LoaderService } from './@shared/pipes/loader.service';
import { TokenInterceptorService } from './@shared/http/token.interceptor';
import { AddBulkEmployeeComponent } from './add-bulk-employee/add-bulk-employee.component';
import { RemoveBulkEmployeeComponent } from './remove-bulk-employee/remove-bulk-employee.component';
import { ConfirmDialogComponent } from './@shared/confirm.dialog';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { EditEmpComponent } from './edit-emp/edit-emp.component';
import { StylePaginatorDirective } from './@shared/directive/style-paginator.directive';
import { ShiftComponent } from './shift/shift.component';
import { ReportComponent } from './report/report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyComponent } from './company/company/company.component';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { LocationComponent } from './location/location/location.component';
import { AddLocationComponent } from './location/add-location/add-location.component';
import { EditLocationComponent } from './location/edit-location/edit-location.component';
import { DepartmentComponent } from './department/department/department.component';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { EditDepartmentComponent } from './department/edit-department/edit-department.component';
import { ChartModule } from 'angular-highcharts';
// import { RegisterComponent } from './auth/register/register.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfileComponent } from './profile/profile.component';
import { ReportFilterComponent } from './report/report-filter/report-filter.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
const TOASTER_SETTINGS = {
  timeOut: 3000,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  easing: 'ease-in-out',
};
@NgModule({
  declarations: [
    ConfirmDialogComponent,
    AppComponent,
    SidenavComponent,
    HeaderComponent,
    HomeComponent,
    AuthComponent,
    DashboardComponent,
    LoaderComponent,
    NotfoundComponent,
    EmployeeComponent,
    AddShiftComponent,
    AddEmployeeComponent,
    AddBulkEmployeeComponent,
    RemoveBulkEmployeeComponent,
    EditShiftComponent,
    EditEmpComponent,
    StylePaginatorDirective,
    ShiftComponent,
    ReportComponent,
    CompanyComponent,
    AddCompanyComponent,
    EditCompanyComponent,
    LocationComponent,
    AddLocationComponent,
    EditLocationComponent,
    DepartmentComponent,
    AddDepartmentComponent,
    EditDepartmentComponent,
    ProfileComponent,
    ReportFilterComponent,
    // RegisterComponent,
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    MainMaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    ChartModule,
    ToastrModule.forRoot(TOASTER_SETTINGS),
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  providers: [ LoaderService,DatePipe,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true,
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
