import { viewEmployeeItemDto } from './../@shared/models/viewEmployee.model';
import {SelectionModel} from '@angular/cdk/collections';
import { Logger } from './../@shared/logger.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './../@shared/pipes/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../@shared/confirm.dialog';
import { Emp_Data } from '../@shared/models/dataSource';
import { finalize } from 'rxjs';
import { addEmployeeItemDto } from '../@shared/models/addEmployee.model';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from '../app.service'
import { CredentialsService } from '../auth/credentials.service';
import { NgxSpinnerService } from "ngx-spinner";

const log=new Logger('Employee');
@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'days',
    'clock_in_time',
    'clock_out_time',
    'actions',
  ];
  role : string = '';
  dataSource = new MatTableDataSource<viewEmployeeItemDto>(Emp_Data);
  dataSourceWithPageSize = new MatTableDataSource<viewEmployeeItemDto>(Emp_Data);
  selection = new SelectionModel<viewEmployeeItemDto>(true, []);
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  constructor(private paginator1: MatPaginatorIntl,
      private router:Router, 
      public dialog: MatDialog,
      private loader:LoaderService,
      private toastr:ToastrService, 
      private appService:AppService,
      private service:AppService,
      private spinner: NgxSpinnerService) {
    paginator1.itemsPerPageLabel = 'The amount of data displayed';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  comapnyId:any
  token:any
  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if(this.token == null){
      this.router.navigateByUrl('/');
    }
    else{
      this.role = this.service.getRole();
      this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
      this.getAllShift();
      this.getAllCompany();
      this.getAllDepartment();
      this.getLocationByCompanyId();
    }
  }
  locationData: any
  getLocationByCompanyId() {
    this.service.getLocationByCompany(this.comapnyId).subscribe(
      (response: any) => {
        this.locationData = response.data[0];
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  
  getAllShifts: any = []
  shiftData : any = []
  getAllShift(){
    if(this.role == 'SA'){
    this.spinner.show();
      this.service.getAllShift().subscribe((response:any) => {
        this.spinner.hide();
        this.shiftData = response.data
        this.dataSource.data=response.data;
        // this.getAllShifts=response.data;
       },
       error => {
        this.service.handleError(error);
        this.spinner.hide();
       }
     );
    }else {
    this.spinner.show();
      this.service.getShiftByCompany().subscribe((response:any) => {
        this.spinner.hide();
        // this.getAllShifts =response.data;
        this.shiftData = response.data
        this.dataSource.data=response.data;
       },
       error => {
        this.service.handleError(error);
        this.spinner.hide();
       }
     );
    }
  }
  companyData:any
  getAllCompany() {
    this.service.getAllCompany().subscribe(
      (response: any) => {
        this.companyData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  departmentData: any;
  getAllDepartment() {
    this.service.getAllDepartment().subscribe(
      (response: any) => {
        this.departmentData = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  
  selectedCompanyId:any
  onCompanySelect(event:any){
    const selectedValue = event.target.value;
    this.selectedCompanyId = selectedValue === "" ? "" : parseInt(selectedValue);
    this.filterCompAndDepartment(this.selectedCompanyId, this.selectedDepartmentId)
  }

  selectedDepartmentId:any
  onDepartmentSelect(event:any){
    const selectedValue = event.target.value;
    this.selectedDepartmentId = selectedValue === "" ? "" : parseInt(selectedValue);
    this.filterCompAndDepartment(this.selectedCompanyId, this.selectedDepartmentId)
  }

  // filterShiftData(event:any){
  //   const searchData = event.target.value
  //   this.dataSource.data = this.shiftData.filter(
  //     (shift: any) =>
  //     shift.name.toString().includes(searchData) || 
  //     shift.days.toString().includes(searchData)
  //   );
  // }
  
  filterShiftData(event: any) {
    const searchData = event.target.value.toLowerCase(); // Convert search data to lowercase
    this.dataSource.data = this.shiftData.filter(
      (shift: any) =>
        shift.name.toLowerCase().includes(searchData) ||
        shift.days.toString().toLowerCase().includes(searchData)
    );
  }
  

  filterCompAndDepartment(selectedCompanyId:any,selectedDepartmentId:any){
    if(this.role!=="SA"){
      selectedCompanyId = this.service.getCompanyId()
    }
    if ((selectedCompanyId === ""||selectedCompanyId==undefined ) && (selectedDepartmentId === "" ||selectedDepartmentId==undefined)) {
      this.getAllShift();
    }else{
      this.service.filterCompAndDepartment(selectedCompanyId,selectedDepartmentId).subscribe((response:any) => {
        this.dataSource.data=response.body.data;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
 
  }
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  goto_addShift(){
    this.router.navigate(['/dashboard/add-shift']);
  }
  goto_addbulkEmployee(){
    this.router.navigate(['/dashboard/addBulk-employee']);
  }

  ConfirmDeleteEmp(shiftId:number) {
    const message = `Are you sure you want to delete this record?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if(data==true)
      {
        this.deleteShift(shiftId);
      }
    });
  }

  deleteShift(shiftId:any) {
    this.loader.display(true);
    this.service.deleteShift(shiftId).subscribe((response:any) => {
       if(response.success==true){
        this.toastr.success(response.msg);
       }
       this.getAllShift();
      },
      error => {
        this.service.handleError(error);
      }
    );
  }

}
