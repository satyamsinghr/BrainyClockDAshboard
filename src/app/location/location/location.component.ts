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
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../@shared/confirm.dialog';
import { Emp_Data } from '../../@shared/models/dataSource';
import { finalize } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from '../../app.service';
import { AddLocationComponent } from '../add-location/add-location.component';
import { EditLocationComponent } from '../edit-location/edit-location.component';

const log = new Logger('Employee');
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'locationId',
    'companyId',
    'location_name',
    'address',
    'pincode',
    'actions',
  ];
  displayedColumnsCompany: string[] = [
    'select',
    'locationId',
    'location_name',
    'address',
    'pincode',
    'actions',
  ];

  dataSource = new MatTableDataSource(Emp_Data);
  dataSourceWithPageSize = new MatTableDataSource(Emp_Data);
  selection = new SelectionModel(true, []);
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  nameOfCompany = JSON.parse(localStorage.getItem('nameOfCompany'));
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  constructor(
    private paginator1: MatPaginatorIntl,
    private router: Router,
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

  role: any;
  companyId: number;
  comapnyId: any
  token: string
  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if (this.token == null) {
      this.router.navigateByUrl('/');
    }
    else {
      this.role = this.service.getRole();
      this.companyId = this.service.getCompanyId();
      this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
      // this.getLocationByCompanyId();
      this.getAllLocation();
    }
  }

  // locationData: any
  // getLocationByCompanyId() {
  //   this.spinner.show();
  //   this.service.getLocationByCompany(this.comapnyId).subscribe(
  //     (response: any) => {
  //       this.spinner.hide();
  //       this.locationData = response.data[0];
  //     },
  //     (error) => {
  //       this.service.handleError(error);
  //       this.spinner.hide();
  //     }
  //   );
  // }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // filterOfficeData(event:any){
  //   const searchData = event.target.value
  //   this.dataSource.data = this.officeData.filter(
  //     (office : any) =>
  //     office.location_name.toString().includes(searchData) || 
  //     office.id.toString().includes(searchData) || office.pincode.toString().includes(searchData) || office.address.toString().includes(searchData)
  //   );
  // }
  filterOfficeData(event: any) {
    const searchData = event.target.value.toLowerCase(); // Convert search data to lowercase
    this.dataSource.data = this.officeData.filter(
      (office: any) =>
        office.location_name.toLowerCase().includes(searchData) ||
        office.id.toString().toLowerCase().includes(searchData) ||
        office.pincode.toString().toLowerCase().includes(searchData) ||
        office.address.toLowerCase().includes(searchData)
    );
  }


  officeData: any = []
  getAllLocation() {
    if (this.role == 'SA') {
      this.spinner.show();
      this.service.getAllLocation().subscribe(
        (response: any) => {
          this.spinner.hide();
          this.officeData = response.data
          this.dataSource.data = response.data;
        },
        (error) => {
          this.service.handleError(error);
          this.spinner.hide();
        }
      );
    } else {
      this.service.getLocationByCompany(this.companyId).subscribe(
        (response: any) => {
          this.officeData = response.data
          this.dataSource.data = response.data;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  goto_addLocation() {
    this.router.navigate(['/dashboard/add-location']);
  }

  goto_addbulkEmployee() {
    // this.router.navigate(['/dashboard/addBulk-employee']);
  }

  ConfirmDeleteLocation(locationId: number) {
    const message = `Are you sure you want to delete this record?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data == true) {
        this.deleteCompany(locationId);
      }
    });
  }

  deleteCompany(locationId: any) {
    this.service.deleteLocation(locationId).subscribe(
      (response: any) => {
        if (response.success == true) {
          this.toastr.success(response.msg);
        }
        this.getAllLocation();
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }


  openAddOfficeModal() {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: '728px',
      height: '600px'
    });
    // dialogRef.afterClosed().subscribe(result => {
    dialogRef.componentInstance.locationAdded.subscribe(() => {
      // Handle modal close event if needed
      this.getAllLocation();
      console.log('The modal was closed');
    });
  }

  EditAddOfficeModal(locationId: number): void {
    const dialogRef = this.dialog.open(EditLocationComponent, {
      width: '500px',
      data: { locationId: locationId },
    });
    dialogRef.componentInstance.locationEdit.subscribe(() => {
      // dialogRef.afterClosed().subscribe((result) => {
      this.getAllLocation();
      console.log('The dialog was closed');
    });
  }
}



