import { viewEmployeeItemDto }    from './../@shared/models/viewEmployee.model';
import { SelectionModel }         from '@angular/cdk/collections';
import { Logger }                 from './../@shared/logger.service';
import { ToastrService }          from 'ngx-toastr';
import { LoaderService }          from './../@shared/pipes/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }              from '@angular/material/dialog';
import { MatPaginator }           from '@angular/material/paginator';
import { MatSort }                from '@angular/material/sort';
import { MatTableDataSource }     from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../@shared/confirm.dialog';
import { Emp_Data } from '../@shared/models/dataSource';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from './../app.service';
import { ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
const log = new Logger('Employee');
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = [
    // 'select',
    'id',
    'employeeName',
    'departmentName',
    'role',
    'status',
    'shifts',
    'primaryLocation',
    'actions',
  ];
  role: string = '';
  dataSource = new MatTableDataSource<viewEmployeeItemDto>(Emp_Data);
  dataSourceWithPageSize = new MatTableDataSource<viewEmployeeItemDto>(
    Emp_Data
  );
  selection = new SelectionModel<viewEmployeeItemDto>(true, []);
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  count = 0;
  pageNumber: number;
  locationid : string = ''
  allEmployee : any = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  constructor(
    private paginator1: MatPaginatorIntl,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loader: LoaderService,
    private toastr: ToastrService,
    private service: AppService,
    private spinner: NgxSpinnerService
  ) {
    paginator1.itemsPerPageLabel = 'The amount of data displayed';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  comapanyId:any
  token: any
  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if(this.token == null){
      this.router.navigateByUrl('/');
    }
    else{
      this.role = this.service.getRole();
      this.comapanyId = JSON.parse(localStorage.getItem('comapnyId'));
      this.getLocationByCompanyId();
      if (this.role != 'SA'){
           this.service.getDepartmentById(this.comapanyId).subscribe(
             (response: any) => {
                this.departmentData = response;
             },
             (error) => {
              this.service.handleError(error);
             }
           );
      
      } else {
        this.getAllDepartment();
      }
    
      const companyId = this.route.snapshot.queryParams['companyId'];
      this.locationid = this.route.snapshot.queryParams['locationId'];
      if (companyId && this.locationid) {
        this.filterEmployee(companyId, '', '')
      } else {
        this.getAllEmployee();
      }
      this.getAllCompany();
      // this.getAllDepartment();
  
     
      this.role = JSON.parse(localStorage.getItem('role'));
    }

    
  }

  locationData: any
  getLocationByCompanyId() {
    this.service.getLocationByCompany(this.comapanyId).subscribe(
      (response: any) => {
        this.locationData = response.data[0];
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  departmentData: any;
  getAllDepartment() {
    if(this.role === 'SA'){
      this.service.getAllDepartment().subscribe(
        (response: any) => {
          this.departmentData = response.data;
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

  employeeData: any = []
  getAllEmployee() {
    if (this.role == 'SA') {
      this.spinner.show();
      this.service.getAllEmployee().subscribe(
        (response: any) => {
          this.spinner.hide();
          // this.allEmployee = response.data;
          this.employeeData = response.data
          this.dataSource.data = response.data;
        },
        (error) => {
          this.service.handleError(error);
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.show();
      this.service.getAllEmployeeByCompany().subscribe(
        (response: any) => {
          this.spinner.hide();
          // this.allEmployee = response.data;
          this.employeeData = response.data
          this.dataSource.data = response.data;
        },
        (error) => {
          this.service.handleError(error);
          this.spinner.hide();
        }
      );
    }
  }

uncheckAll() {
  this.checkboxes.forEach((element) => {
    element.nativeElement.checked = false;
    this.departmentId=[];
  });
this.filterEmployee(
  this.selectedCompanyId,
  this.departmentId,
  this.name,
);
}
departmentId: any[] = [];
getEmployeeNames(id:any){
  const index = this.departmentId.indexOf(id);
    if (index !== -1) {
      this.departmentId.splice(index, 1); 
    } else {
      this.departmentId.push(id);
    }
this.filterEmployee(
  this.selectedCompanyId,
  this.departmentId,
  this.name,
);
  
  }

  companyData: any;
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

  selectedCompanyId: any;
  onCompanySelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedCompanyId =
      selectedValue === '' ? '' : parseInt(selectedValue);
    this.filterEmployee(
      this.selectedCompanyId,
      this.selectedDepartmentId,
      this.name,
    );
  }

  selectedDepartmentId: any;
  onDepartmentSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedDepartmentId =
      selectedValue === '' ? '' : parseInt(selectedValue);
    this.filterEmployee(
      this.selectedCompanyId,
      this.selectedDepartmentId,
      this.name,
    );
  }
  name: any;
  onFirstNameChange(event: any) {
    this.name = event.target.value;
    if (this.role !== 'SA') {
      this.selectedCompanyId = this.service.getCompanyId();
    }
    if (this.name) {
      this.service
        .filterEmployee(
          this.selectedCompanyId,
          this.selectedDepartmentId,
          this.name,
          ''
        )
        .subscribe((response: any) => {
          this.suggestions = response.body.data.map(
            (employee: any) => `${employee.firstName} ${employee.lastName}`
          );
        });
    } else {
      this.filterEmployee(
        this.selectedCompanyId,
        this.selectedDepartmentId,
        this.name,
      );
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.name = suggestion;
    this.filterEmployee(
      this.selectedCompanyId,
      this.selectedDepartmentId,
      this.name,
    );
    this.suggestions = [];
  }

  suggestions: any[] = [];
  searchEmployeeData : string


  // filterEmployeeData(event:any){
  //   const searchData = event.target.value
  //   this.dataSource.data = this.employeeData.filter(
  //     (employee :any) =>
  //     employee.firstName.toString().includes(searchData) || 
  //     employee.id.toString().includes(searchData)
  //   );
  // }
  filterEmployeeData(event: any) {
    const searchData = event.target.value.toLowerCase(); // Convert search data to lowercase
    this.dataSource.data = this.employeeData.filter(
      (employee: any) =>
        employee.firstName.toLowerCase().includes(searchData) ||
        employee.id.toString().toLowerCase().includes(searchData) ||
        employee.department_name.toString().toLowerCase().includes(searchData)
    );
  }
  

  filterEmployee(selectedCompanyId: any, selectedDepartmentId: any, name: any) {
    if (this.role !== 'SA') {
      selectedCompanyId = this.service.getCompanyId();
    }
    if (selectedCompanyId === '' && selectedDepartmentId === '' && name === '' && this.locationid === '') {
      this.getAllEmployee();
    } else {
      this.service
        .filterEmployee(selectedCompanyId, selectedDepartmentId, name, this.locationid)
        .subscribe(
          (response: any) => {
            this.dataSource.data = response.body.data;
          },
          (error) => {
            this.service.handleError(error);
          }
        );
    }
  }

  // filterEmployee(selectedCompanyId: any, selectedDepartmentId: any, name: any) {
  //   if (this.role !== 'SA') {
  //     selectedCompanyId = this.service.getCompanyId();
  //   }
  //   if (selectedCompanyId === '' && selectedDepartmentId === '' && name === '' && this.locationid === '') {
  //     this.getAllEmployee();
  //   } else {
  //     this.service
  //       .filterEmployee(selectedCompanyId, selectedDepartmentId, name, this.locationid)
  //       .subscribe(
  //         (response: any) => {
  //           this.dataSource.data = response.body.data;
  //         },
  //         (error) => {
  //         this.service.handleError(error);
  //         }
  //       );
  //   }
  // }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  goto_addEmployee() {
    this.router.navigate(['/dashboard/add-employee']);
  }
  goto_addbulkEmployee() {
    this.router.navigate(['/dashboard/addBulk-employee']);
  }
  ConfirmDeleteEmp(employeeId: number) {
    const message = `Are you sure you want to delete this record?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data == true) {
        this.deleteEmployee(employeeId);
      }
    });
  }
  deleteEmployee(employeeId: any) {
    this.service.deleteEmployee(employeeId).subscribe(
      (response: any) => {
        if (response.success == true) {
          this.toastr.success(response.msg);
        }
        this.getAllEmployee();
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
}
