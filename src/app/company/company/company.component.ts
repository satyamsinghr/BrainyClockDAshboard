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
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../@shared/confirm.dialog';
import { Emp_Data } from '../../@shared/models/dataSource';
import { finalize } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from '../../app.service';
import { EditCompanyComponent } from '../edit-company/edit-company.component';
import { AddCompanyComponent } from '../add-company/add-company.component';
import { CompanyService } from 'src/app/company.service';
const log = new Logger('Employee');
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'companyId',
    'name',
    'email',
    'isAccountActivated',
    'actions',
  ];
   
  
  dataSource = new MatTableDataSource(Emp_Data);
  dataSourceWithPageSize = new MatTableDataSource(Emp_Data);
  selection = new SelectionModel(true, []);
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  constructor(
    private paginator1: MatPaginatorIntl,
    private router: Router,
    public dialog: MatDialog,
    private loader: LoaderService,
    private toastr: ToastrService,
    private service: AppService,
    private companyService:CompanyService
  ) {
    paginator1.itemsPerPageLabel = 'The amount of data displayed';
  }
  
  nameOfCompany = JSON.parse(localStorage.getItem('nameOfCompany'));
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  comapnyId:any
  role:any;
  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('role'));
    this.companyService.getAllCompany = this.getAllCompany.bind(this);
    this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
    if(this.role === null){
      this.router.navigate(['**'])}
    this.getAllCompany();
    this.getLocationByCompanyId();
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
  companyData:any
  getAllCompany() {
    this.service.getAllCompany().subscribe(
      (response: any) => {
        this.companyData = response.data;
        this.dataSource.data = this.companyData;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  name:any
  suggestionName:any[] = []
  onFirstNameChange(event: any) {
     this.name = event.target.value; 
    if ( this.name) {
      this.service.filterCompany(this.name,this.email).subscribe((response:any) => {
        this.suggestionName = response.body.data.map((employee: any) => employee.name);
        })
    }
    else if (this.name == "" || this.name === null || this.name === undefined){
      this.filterCompany(this.name,this.email);
      this.suggestionName=[];
      console.log("this.suggestionName",this.suggestionName);
      
    }
  }
 
  filterCompanyData(event: any) {
    const searchData = event.target.value.toLowerCase(); // Convert search data to lowercase
    this.dataSource.data = this.companyData.filter(
      (company: any) =>
        company.name.toLowerCase().includes(searchData) ||
        company.email.toString().toLowerCase().includes(searchData)
    );
  }
  

  selectSuggestionName(suggestion: string) {
    this.name = suggestion;
    this.filterCompany(this.name,this.email);
    this.suggestionName = [];
  }
  email:any
  suggestionEmail:any[] = []
  onFirstEmailChange(event: any) {
     this.email = event.target.value; 
    if ( this.email) {
      this.service.filterCompany(this.name,this.email).subscribe((response:any) => {
        this.suggestionEmail = response.body.data.map((employee: any) => employee.email);
        })
    }else{
      this.filterCompany(this.name,this.email);
      this.suggestionEmail=[];
    }
  }

  selectSuggestionEmail(suggestion: string) {
    this.email = suggestion;
    this.filterCompany(this.name,this.email);
    this.suggestionEmail = [];
  }

  filterCompany(suggestionName:any,suggestionEmail:any){
  if(suggestionName === "" && suggestionEmail === ""){
   this.getAllCompany();
  }else{
    this.service.filterCompany(suggestionName,suggestionEmail).subscribe((response:any) => {
      this.dataSource.data=response.body.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  
}
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  goto_addCompany() {
    this.router.navigate(['/dashboard/add-company']);
  }
  goto_addbulkEmployee() {
    // this.router.navigate(['/dashboard/addBulk-employee']);
  }
  ConfirmDeleteCompany(companyId: number) {
    const message = `Are you sure you want to delete this record?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data == true) {
        this.deleteCompany(companyId);
      }
    });
  }
  deleteCompany(companyId: any) {
    this.service.deleteCompany(companyId).subscribe(
      (response: any) => {
        if (response.success == true) {
          // this.toastr.success(response.msg);
        }
        this.getAllCompany();
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  openAddCompanyModal() {
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '100%', maxWidth: '420px' // adjust width as needed
      // You can pass data to the modal if needed
      // data: { anyData: yourData },
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
      console.log('The modal was closed');
    });
  }

  openEditCompanyModal(row: any) {
    const dialogRef = this.dialog.open(EditCompanyComponent, {
      width: '100%', maxWidth: '420px', // adjust width as needed
      // Pass department ID to the modal if needed
      data: {
        row: row
      }
    });
    // this.getAllDepartment() ;
    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
      console.log('The edit company modal was closed');
    });
  }
}
