import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { addEmployeeItemDto, APIResponse } from './@shared/models/addEmployee.model';
import { addShiftItemDto } from './@shared/models/addShift.model';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
const routes = {
  Post_AddEmployee: `/admin/addemployee`,
  Post_AddShift: `/admin/addshift`,
  Post_ChangePassword: `/company/change-password`,
  Post_AddBulkEmployee: `/employee/bulk-import`,
  Get_AllEmployee: `/admin/all-employees`,
  Get_AllEmployee_Company: (id: number) => `/admin/get-employees-by-company/${id}`,
  Delete_Employee: (employeeId: number) => `/admin/delete-employee/${employeeId}`,
  Post_UpdateEmployee: (id: number) => `/admin/update-employee/${id}`,
  Post_Shift: `/shift/add`,
  Get_ShiftById: (id: number) => `/shift/get-single-shift/${id}`,
  Get_ShiftByCompany: (id: number) => `/shift/get-shifts-by-company/${id}`,
  Get_AllShift: `/shift/all`,
  Delete_Shift: (id: number) => `/shift/${id}`,
  Update_Shift: (id: number) => `/admin/shift/${id}`,
  Get_EmployeeById: (id: number) => `/admin/getemployee/${id}`,
  Post_AddCompany: `/admin/addcompany`,
  Post_EditCompany: (id: number) => `/company/${id}`,
  Delete_Company: (id: number) => `/company/${id}`,
  Get_CompanyById: (id: number) => `/company/get-single-company/${id}`,
  Delete_Location: (id: number) => `/admin/delete-location/${id}`,
  Post_AddLocation: `/admin/addlocation`,
  Post_EditLocation: (id: number) => `/admin/update-location/${id}`,
  Get_LocationById: (id: number) => `/admin/location/${id}`,
  Delete_Department: (id: number) => `/admin/delete-department/${id}`,
  Get_LocationByCompanyId: (id: number) => `/admin/location/companyid/${id}`,
  Get_ReportByCompanyId: (id: number) => `/admin/attendance/${id}`,
  Get_AllReport: `/admin/getattendance`,
  Post_AddDepartment: `/admin/addDepartment`,
  Get_DepartmentById: (id: number) => `/admin/departments/${id}`,
  Post_EditDepartment: (id: number) => `/admin/update-department/${id}`,
  Get_companyOfficeById: (id: number) => `/admin/location/companyid/${id}`,
  Get_Schudle: (id: number) => `/company/get-schedule?companyId=${id}`,
  Post_updateSchudle:`/company/update-schedule`,
  Post_Schudle:`/company/create-schedule`,
  Delete_Schudle: `/company/delete-schedule`,
  Post_ResetPassword: `/company/reset-password`,
};



@Injectable({
  providedIn: 'root'
})
export class AppService {

  nav_active_class: any;
  
  // public apiConfig = environment.local_url;
  public apiConfig=environment.base_url;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Accept': 'text/plain',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginToken'))}`
    }),
  };

  httpOptions1 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Accept': 'text/plain',
      // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginToken'))}`
    }),
  };



  handleError(error: any) {
    if (error.status === 401) {
      this.router.navigateByUrl('/');
      localStorage.removeItem('loginToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('companyName');
      localStorage.removeItem('nameOfCompany');
      localStorage.removeItem('comapnyId');
    } else {
      const errorMessage = error.error.msg || error.message;
      this.toastr.error(errorMessage);
    }
  }

  addEmployee(data: any): Observable<APIResponse> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    const shiftKeys = ['shifts1', 'shifts2', 'shifts3'];
    const shifts = [];
    for (const key of shiftKeys) {
      const shiftValue = data[key];
      if (shiftValue !== null && shiftValue !== undefined && shiftValue !== "") {
        shifts.push(parseInt(shiftValue));
      }
    }
    const modifiedData = {
      "company_id": data.company_id,
      "firstName": data.firstName,
      "lastName": data.lastName,
      "email": data.email,
      // "password": data.password, 
      "shifts": shifts,
      "department_id": data.department_id,
      "location_id": data.location_id,
      "hourlyRate": data.hourlyRate,
      "overTime": data.overTime,
      "type": data.type
      // "created_by": userId,
    };
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_AddEmployee, modifiedData, { headers });
  }

  employeeFile(emoloyeeFileUpload: File): Observable<APIResponse> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('file', emoloyeeFileUpload);
    const url = this.apiConfig + '/admin/upload-excel';
    return this.http.post<APIResponse>(url, formData, { headers });
  }
  


  forgotPassword(email: any): Observable<APIResponse> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('email', email);
    const url = this.apiConfig + '/company/forgot-password';
    return this.http.post<APIResponse>(url, formData, { headers });
  }

  updateEmployee(data: any, id: number): Observable<APIResponse> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const shiftKeys = ['shifts1', 'shifts2', 'shifts3'];
    const shifts = [];
    for (const key of shiftKeys) {
      const shiftValue = data[key];
      if (shiftValue !== null && shiftValue !== undefined && shiftValue !== "") {
        shifts.push(parseInt(shiftValue));
      }
    }
    const modifiedData = {
      companyId: data.companyId.toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      // overTime:data.overTime,
      // hourlyRate:data.hourlyRate,
      overTime: (data.overTime != null && data.overTime !== "") ? data.overTime : "",
      hourlyRate: (data.hourlyRate != null && data.hourlyRate !== "") ? data.hourlyRate : "",
      shifts: shifts,
      type: data.type

      // officeId: data.
    };
    return this.http.put<APIResponse>(this.apiConfig + routes.Post_UpdateEmployee(id), modifiedData, { headers })
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  addCompany(data: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    let companyData = {
      email: data.email,
      name: data.name,
      created_by: userId
    }
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_AddCompany, companyData, { headers });
  }
  editCompany(data: any, id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    let companyData = {
      email: data.email,
      name: data.name,
      created_by: userId
    }
    return this.http.put<APIResponse>(this.apiConfig + routes.Post_EditCompany(id), companyData, { headers });
  }
  editDepartment(data: any, id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    let companyData = {
      department: data.department,
      created_by: userId
    }
    return this.http.put<APIResponse>(this.apiConfig + routes.Post_EditDepartment(id), companyData, { headers });
  }

  addLocation(data: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    let companyData = {
      company_id: data.companyId,
      location_name: data.location_name,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pinCode,
      geofence_radius: data.geofence,
      latitude: data.latitude,
      longitude: data.longitude
    }
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_AddLocation, companyData, { headers });
  }
  editLocation(data: any, id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    let companyData = {
      company_id: data.companyId,
      location_name: data.location_name,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pinCode,
      latitude: data.latitude,
      longitude: data.longitude,
      geofence_radius: data.geofence,
    }
    return this.http.put<APIResponse>(this.apiConfig + routes.Post_EditLocation(id), companyData, { headers });
  }

  addDepartment(data: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_AddDepartment, data, { headers });
  }
  addBulkEmployee(data: addEmployeeItemDto[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_AddBulkEmployee, data);
  }
  getAllEmployee(): Observable<addEmployeeItemDto[]> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<addEmployeeItemDto[]>(this.apiConfig + routes.Get_AllEmployee, { headers });
  }
  getAllEmployeeByCompany(): Observable<addEmployeeItemDto[]> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const comapnyId = this.getCompanyId();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<addEmployeeItemDto[]>(this.apiConfig + routes.Get_AllEmployee_Company(comapnyId), { headers });
  }
  deleteEmployee(employeeId: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiConfig + routes.Delete_Employee(employeeId), { headers });
  }
  deleteCompany(companyId: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiConfig + routes.Delete_Company(companyId), { headers });
  }
  deleteLocation(companyId: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiConfig + routes.Delete_Location(companyId), { headers });
  }
  deleteDepartment(companyId: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiConfig + routes.Delete_Department(companyId), { headers });
  }
  addShift(data: any, selectedDays: any): Observable<APIResponse> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    const requestData = {
      companyId: data.companyId,
      locationId: data.locationId,
      department_id: data.department_id,
      name: data.name,
      days: selectedDays.join(','),
      clockInTime: data.clockInTime,
      clockOutTime: data.clockOutTime
    };
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_AddShift, requestData, { headers });
  }
  getShiftById(id: number): Observable<addShiftItemDto> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<addShiftItemDto>(this.apiConfig + routes.Get_ShiftById(id), { headers });
  }
  getEmployeeById(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_EmployeeById(id), { headers });
  }
  getCompanyById(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_CompanyById(id), { headers });
  }
  getLocationById(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_LocationById(id), { headers });
  }

  getLocationByCompany(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_LocationByCompanyId(id), { headers });
  }

  getCompanyOfficeLocation(id: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_companyOfficeById(id), { headers });
  }

  getDepartmentById(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_DepartmentById(id), { headers });
  }
  getShiftByCompany(): Observable<addShiftItemDto> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const companyId = this.getCompanyId()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<addShiftItemDto>(this.apiConfig + routes.Get_ShiftByCompany(companyId), { headers });
  }
  updateShift(updateDto: addShiftItemDto, id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    const requestData = {
      ...updateDto,
      created_by: userId
    };
    return this.http.put(this.apiConfig + routes.Update_Shift(id), requestData, { headers });
  }

  getAllReports() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<addEmployeeItemDto[]>(this.apiConfig + routes.Get_AllReport, { headers });
  }

  getReportByCompany(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<addEmployeeItemDto[]>(this.apiConfig + routes.Get_ReportByCompanyId(id), { headers });
  }


  login(body: any) {
    const data = {
      email: body.email,
      password: body.password,
    };

    let url_ = this.apiConfig + '/admin/adminlogin';
    return this.http.post<any>(url_, data, this.httpOptions1)
  }
  register(body: any) {
    let url_ = this.apiConfig + '/admin/adminSignup';
    return this.http.post<any>(url_, body)
  }

  updatePassword(body: any, email: any): Observable<any> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = {
      email: email,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword
    };
    return this.http.post<any>(this.apiConfig + routes.Post_ChangePassword, data, { headers });
  }


  getAllShift() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + '/admin/allshifts';
    return this.http.get(url_, { headers });
  }
  getAllCompany() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + '/company/all';
    return this.http.get(url_, { headers });
  }
  getAllLocation() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + '/admin/all-location';
    return this.http.get(url_, { headers });
  }
  getAllDepartment() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + '/admin/alldepartments';
    return this.http.get(url_, { headers });
  }

  getEmployeeNamesForDepartment(departmentId: any): Observable<any> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url_ = this.apiConfig + `/admin/get-employee-depdartmentid/${departmentId}`;
    return this.http.get(url_, { headers });
  }

  deleteShift(shiftId: any): Observable<any> {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url_ = `${this.apiConfig}/admin/shift/${shiftId}`;
    return this.http.delete(url_, { headers });
  }

  filterCompAndDepartment(selectedCompanyId: any, selectedDepartmentId: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const companyIdParam = selectedCompanyId || '';
    const departmentIdParam = selectedDepartmentId || '';

    let queryParams = new HttpParams()
    if (companyIdParam !== '') {
      queryParams = queryParams.set('companyId', companyIdParam);
    }
    if (departmentIdParam !== '') {
      queryParams = queryParams.set('departmentId', departmentIdParam);
    }
    const url_ = `${this.apiConfig}/admin/filtershifts`;
    return this.http.get<any>(url_, { headers: headers, params: queryParams, observe: 'response' })
  }
  filterEmployee(selectedCompanyId: any, selectedDepartmentId: any, name: any, locationId: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let queryParams = new HttpParams()
      .set("company_id", selectedCompanyId !== undefined && selectedCompanyId !== null ? selectedCompanyId : "")
      .set("department_id", selectedDepartmentId !== undefined && selectedDepartmentId !== null ? selectedDepartmentId : "")
      .set("location_id", locationId !== undefined && locationId !== null ? locationId : "")
      .set("name", name !== undefined && name !== null ? name : "")
    const url_ = `${this.apiConfig}/admin/filteremployees`;
    return this.http.get<any>(url_, { headers: headers, params: queryParams, observe: 'response' })
  }
  filterReport(reportNameValue: any, selectedCompanyId: any, selectedReportType: any, startDate: any, endDate: any, selectedLocation: any, selectedDepartmentIds: any, selectedShift: any) {

    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let queryParams = new HttpParams()
      .set("reportName", reportNameValue || "")
      .set("companyId", selectedCompanyId || "")
      .set("reportType", selectedReportType || "")
      .set("startDate", startDate || "")
      .set("endDate", endDate || "")
      .set("locationId", selectedLocation || "");

    if (selectedDepartmentIds && selectedDepartmentIds.length > 0) {
      queryParams = queryParams.set("departmentIds", selectedDepartmentIds.join(','));
    }

    if (selectedShift && selectedShift.length > 0) {
      queryParams = queryParams.set("shiftIds", selectedShift.join(','));
    }

    const url_ = `${this.apiConfig}/admin/attendencefilter`;
    return this.http.get<any>(url_, { headers: headers, params: queryParams, observe: 'response' })
  }
  filterByReportsId(id: any) {

    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let queryParams = new HttpParams()
      .set("id", id || "")
    const url_ = `${this.apiConfig}/admin/attendencefilter`;
    return this.http.get<any>(url_, { headers: headers, params: queryParams, observe: 'response' })
  }
  filterAllReports(selectedCompanyId: any) {

    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let queryParams = new HttpParams()
      .set("companyId", selectedCompanyId || "")
    const url_ = `${this.apiConfig}/admin/reportsCriteriasByCompanyId`;
    return this.http.get<any>(url_, { headers: headers, params: queryParams, observe: 'response' })
  }

  filterCompany(suggestionName: any, suggestionEmail: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let queryParams = new HttpParams()
      .set("name", suggestionName !== undefined && suggestionName !== null ? suggestionName : "")
      .set("email", suggestionEmail !== undefined && suggestionEmail !== null ? suggestionEmail : "")
    const url_ = `${this.apiConfig}/admin/filtercopmay`;
    return this.http.get<any>(url_, { headers: headers, params: queryParams, observe: 'response' })
  }
  getRole() {
    return JSON.parse(localStorage.getItem('role'));
  }
  getCompanyId() {
    return JSON.parse(localStorage.getItem('comapnyId'));
  }
  getComapnyName() {
    return JSON.parse(localStorage.getItem('companyName'));
  }

  getAttendanceByCreatedDate() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + '/admin/attandanceByDate';
    return this.http.get(url_, { headers });
  }
  getAttendanceByCompanyId(comapanyId: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + `/admin/attandance/${comapanyId}`;
    return this.http.get(url_, { headers });
  }
  getEmployeeCount() {
    const companyId = this.getCompanyId()
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url_ = this.apiConfig + `/admin/attandance/empoyeeCount/${companyId}`;
    return this.http.get(url_, { headers });
  }
  // getSchudle(id: number) {
  //   const token = JSON.parse(localStorage.getItem('loginToken'));
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   let url_ = this.apiConfig + `/company/get-schedule/companyId/${id}`;
  //   return this.http.get(url_, { headers });
  // }


  getSchudle(id: number) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiConfig + routes.Get_Schudle(id), { headers });
  }
  updateSchudle(data: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    // this.SheduleData = JSON.parse(localStorage.getItem('SchudleGetData'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const companyId = localStorage.getItem('companyId');
    const updateSchudleData = {
      id: data.id,
      companyId: data.companyId,
      timezone: data.timezone,
      timeInterval: data.interval
    };
    return this.http.put<APIResponse>(this.apiConfig + routes.Post_updateSchudle, updateSchudleData, { headers });
  }


  
  createScheudle(data: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let comapnyId = localStorage.getItem('comapnyId')
    let createScheudleData = {
      companyId: parseInt(comapnyId),
      timezone: data.timezone,  
      timeInterval: data.interval,
  
    }
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_Schudle, createScheudleData, { headers });
  }
  // deleteSchudle(data:any) {
  //   const token = JSON.parse(localStorage.getItem('loginToken'));
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   let deleteData = {
  //     id: data.id,
  //     comapnyId: data.comapnyId,
  //   }
  //   return this.http.delete(this.apiConfig + routes.Delete_Schudle,deleteData);
  // }


  deleteSchudle(data: any) {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: {
        id: data.id,
        companyId: data.companyId
      }
    };
    return this.http.delete(this.apiConfig + routes.Delete_Schudle, options);
  }

  resetPassword() {
    const token = JSON.parse(localStorage.getItem('loginToken'));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = localStorage.getItem('userId')
    let data = {
      confirmationCode:"123456",
      email:"new99@mailinator.com",
      password:"Test@1234"
    }
    return this.http.post<APIResponse>(this.apiConfig + routes.Post_ResetPassword, data, { headers });
  }
  
}

