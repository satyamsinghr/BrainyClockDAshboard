import { SelectionModel } from '@angular/cdk/collections';
import { Logger } from '.././../@shared/logger.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '.././../@shared/pipes/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DepartmentService } from 'src/app/department.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../@shared/confirm.dialog';
import { Emp_Data } from '../../@shared/models/dataSource';
import { finalize } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from '../../app.service';
import { AddDepartmentComponent } from '../add-department/add-department.component'
import { EditDepartmentComponent } from '../edit-department/edit-department.component'
const log = new Logger('Employee');
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    // 'id',
    'department_name',
    'Location',
    'Shift',
    'Attendance',
    'shift',
    'attendance',
    'SHift',
    'ATtendance',
    'action'
  ];
  displayedColumnsCompany: string[] = [
    'select',
    // 'id',
    'department_name',
    'Location',
    'Shift',
    'Attendance',
    'shift',
    'attendance',
    'SHift',
    'ATtendance',
    'action'
  ];
  employeeList: any = []
  selectedDepartment: any = []
  departments: any = []
  dataSource = new MatTableDataSource(Emp_Data);
  departmentData: any = []
  dataSourceWithPageSize = new MatTableDataSource(Emp_Data);
  selection = new SelectionModel(true, []);
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  nameOfCompany = JSON.parse(localStorage.getItem('nameOfCompany'));
  constructor(
    private paginator1: MatPaginatorIntl,
    private router: Router,
    public dialog: MatDialog,
    private loader: LoaderService,
    private toastr: ToastrService,
    private service: AppService,
    private spinner: NgxSpinnerService,
    private departmentService: DepartmentService
  ) {
    paginator1.itemsPerPageLabel = 'The amount of data displayed';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  comapnyId: any
  role: any
  searchData: any
  token: any
  ngOnInit(): void {
    this.departmentService.getDepartmentById = this.getDepartmentById.bind(this);
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if (this.token == null) {
      this.router.navigateByUrl('/');
    }
    else {
      this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
      this.role = JSON.parse(localStorage.getItem('role'));
      if (this.role != 'SA') {
        this.getDepartmentById();
        this.getLocationByCompanyId();
      } else {
        this.getAllDepartment();
      }
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  activeDepartmentId: number = null;
  nextDepartment() {
    if (this.activeDepartmentId !== null) {
      const currentIndex = this.departments.findIndex((dept: any) => dept.id === this.activeDepartmentId);
      if (currentIndex < this.departments.length - 1) {
        this.activeDepartment = this.departments[currentIndex + 1].department_name;
        this.activeDepartmentId = this.departments[currentIndex + 1].id;
        this.getEmployeeNames(this.activeDepartment, this.activeDepartmentId);
      }
    }
  }

  previousDepartment() {
    if (this.activeDepartmentId !== null) {
      const currentIndex = this.departments.findIndex((dept: any) => dept.id === this.activeDepartmentId);
      if (currentIndex > 0) {
        this.activeDepartment = this.departments[currentIndex - 1].department_name;
        this.activeDepartmentId = this.departments[currentIndex - 1].id;
        this.getEmployeeNames(this.activeDepartment, this.activeDepartmentId);
      }
    }
  }

  // searchDepartmentData(event:any){
  //   this.searchData = event.target.value 
  //   this.dataSource.data = this.departmentData.filter(
  //     (department : any) =>
  //     department.department_name.toString().includes(this.searchData) || 
  //       department.id.toString().includes(this.searchData)
  //   );
  // }
  searchDepartmentData(event: any) {
    this.searchData = event.target.value.toLowerCase(); // Convert search data to lowercase
    this.dataSource.data = this.departmentData.filter(
      (department: any) =>
        department.department_name.toLowerCase().includes(this.searchData) ||
        department.id.toString().toLowerCase().includes(this.searchData)
    );
  }
  getDepartmentById() {
    this.spinner.show();
    this.service.getDepartmentById(this.comapnyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.dataSource.data = response.data;
        this.departmentData = this.dataSource.data
        this.departments = response;
      },
      (error) => {
        this.service.handleError(error);
        this.spinner.hide();
      }
    );
  }
  getAllDepartment() {
    this.spinner.show();
    this.service.getAllDepartment().subscribe(
      (response: any) => {
        this.spinner.hide();
        // this.dataSource.data = response.data;
        this.departments = response.data;
        if (this.departments.length > 0) {
          this.activeDepartment = this.departments[0].department_name;
          this.activeDepartmentId = this.departments[0].id;
          this.getEmployeeNames(this.departments[0].department_name, this.activeDepartmentId);
        }
      },
      (error) => {
        this.service.handleError(error);
        this.spinner.hide();
      }
    );
  }

  // departmentId: number = 0;
  // activeDepartment: string = '';
  // getEmployeeNames(departmentName: string,departmentId:number) {
  //   // this.activeDepartment = departmentName;
  //   this.activeDepartmentId = departmentId
  //   this.selectedDepartment = departmentName;
  //   this.service.getAllDepartment().subscribe(
  //     (response: any) => {
  //       // this.employeeList = response.data; 
  //       this.dataSource.data = response.data;
  //     },
  //     (error) => {
  //       this.service.handleError(error);
  //       this.dataSource.data = [];
  //     }
  //   );
  // }

  departmentId: number = 0;
  activeDepartment: string = '';
  getEmployeeNames(departmentName: string, departmentId: number) {
    // this.activeDepartment = departmentName;
    this.activeDepartmentId = departmentId
    this.selectedDepartment = departmentName;
    this.service.getEmployeeNamesForDepartment(departmentId).subscribe(
      (response: any) => {
        // this.employeeList = response.data; 
        this.dataSource.data = response.data;
      },
      (error) => {
        this.service.handleError(error);
        this.dataSource.data = [];
      }
    );
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  goto_addDepartment() {
    this.router.navigate(['/dashboard/add-department']);
  }
  goto_addbulkEmployee() {
    // this.router.navigate(['/dashboard/addBulk-employee']);
  }
  ConfirmDeleteDepartment(departmentId: number) {
    const message = `Are you sure you want to delete this record?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data == true) {
        this.deleteDepartment(departmentId);
      }
    });
  }
  deleteDepartment(departmentId: any) {
    this.service.deleteDepartment(departmentId).subscribe(
      (response: any) => {
        if (response.success == true) {
          this.toastr.success(response.msg);
        }
        this.role !== null ? this.getAllDepartment() : this.getDepartmentById()
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }


  openAddDepartmentModal() {
    4
    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      width: '100%', maxWidth: '420px' // adjust width as needed
      // You can pass data to the modal if needed
      // data: { anyData: yourData },
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
      console.log('The modal was closed');
    });
  }

  openEditDepartmentModal(departmentId: number, departmentName: string) {
    const dialogRef = this.dialog.open(EditDepartmentComponent, {
      width: '100%', maxWidth: '420px', // adjust width as needed
      // Pass department ID to the modal if needed
      data: {
        departmentId: departmentId,
        departmentName: departmentName
      }
    });
    // this.getAllDepartment() ;
    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
      console.log('The edit department modal was closed');
    });
  }


}

