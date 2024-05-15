import { Component, OnInit, ViewChild } from '@angular/core';
import { viewEmployeeItemDto } from './../@shared/models/viewEmployee.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { SharedService } from '../shared.service';
// import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  companyId: number
  role: any
  selection = new SelectionModel<viewEmployeeItemDto>(true, []);
  dataSource = new MatTableDataSource<any>([]);
  nameOfCompany = JSON.parse(localStorage.getItem('nameOfCompany'));
  dataSourceWithPageSize = new MatTableDataSource<viewEmployeeItemDto>(

  );
  displayedColumns = ['select', 'reportName', 'reportType', 'dateGenerated', 'reportPeriod', 'Action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  lastUrl: string;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private service: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private sharedService: SharedService
  ) { }

  getCurrentDate(): Date {
    return new Date();
  }

  reportData: any[]
  filterDepartment: any
  filterOffice: any
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  comapnyId: any
  token: any
  shifts: any = []
  pageSize: number = 10;
  ngOnInit(): void {
    const Url = this.router.url;

    const parts = Url.split('/');
    this.lastUrl = parts[parts.length - 1];
    this.sharedService.setLastUrl(this.lastUrl);
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if (this.token == null) {
      this.router.navigateByUrl('/');
    }
    else {
      this.role = this.service.getRole();
      this.companyId = this.service.getCompanyId()
      this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
      // this.role == 'SA' ? this.getReports() : this.getReportByCompany()
      this.getAllCompany();
      this.role == 'SA' ? this.getAllDepartment() : this.getDepartmentById()
      this.getAllShift()
      this.getLocationByCompanyId();
      this.getAllLocation();
      this.filterReport(this.comapnyId);
    }
  }


  generateData: any
  filterReport(selectedCompanyId: any) {
    if (this.role !== "SA") {
      this.spinner.show();
      selectedCompanyId = this.service.getCompanyId();
      this.service.filterAllReports(selectedCompanyId).subscribe((response: any) => {
        this.dataSource.data = response.body.data;
        this.spinner.hide();
      },
        (error: any) => {
          this.service.handleError(error);
          this.spinner.hide();
        });
    } else {
      this.spinner.show();
      selectedCompanyId = this.service.getCompanyId();
      this.service.filterAllReportsAdmin().subscribe((response: any) => {
        this.dataSource.data = response.body.data;
        this.spinner.hide();
      },
        (error: any) => {
          this.service.handleError(error);
          this.spinner.hide();
        });
    }
  }
  reportName: any
  reportType: any

  downloadReport(reportId: number): void {
    if (this.role !== "SA") {
      this.service.filterByReportsId(reportId).subscribe((response: any) => {
        this.generateData = response.body.data.records;
        this.reportName = response.body.data.reportName;
        this.reportType = response.body.data.reportType;
        if (this.generateData.length > 0) {
          this.downloadExcelReport(this.generateData)
        }
      },
        (error: any) => {
          this.service.handleError(error);
        });
    }
  }

  downloadExcelReport(generateData: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    this.addBoldTextRow(worksheet, 'Report Name:', this.reportName ? this.reportName : "");
    this.addBoldTextRow(worksheet, 'Report Type:', this.reportType ? this.reportType : "");

    worksheet.addRow([]);
    const excelData = this.generateExcelData(generateData);
    worksheet.addRow(excelData[0]);
    for (let i = 1; i < excelData.length; i++) {
      worksheet.addRow(excelData[i]);
    }
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'generated_reports.xlsx');
    });
  }
  addBoldTextRow(worksheet: any, label: string, value: string) {
    const boldStyle = { bold: true };
    worksheet.addRow([label, value]).eachCell((cell: any) => {
      cell.font = boldStyle;
    });
  }

  generateExcelData(data: any[]): any[][] {
    const excelData: any[][] = [];
    const headers = Object.keys(data[0]);
    excelData.push(headers);
    data.forEach(item => {
      const row: any[] = [];
      headers.forEach(header => {
        row.push(item[header]);
      });
      excelData.push(row);
    });
    return excelData;
  }

  goto_reportFilter() {
    this.router.navigate(['/dashboard/reportFilter']);
  }

  getAllShift() {
    if (this.role == 'SA') {
      this.service.getAllShift().subscribe((response: any) => {
        this.shifts = response.data
      },
        error => {
          this.service.handleError(error);
        }
      );
    } else {
      this.service.getShiftByCompany().subscribe((response: any) => {
        this.shifts = response.data
      },
        error => {
          this.service.handleError(error);
        }
      );
    }
  }

  allOffice: any = []
  getAllLocation() {
    if (this.role == 'SA') {
      this.service.getAllLocation().subscribe(
        (response: any) => {
          this.allOffice = response.data
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    } else {
      this.service.getLocationByCompany(this.companyId).subscribe(
        (response: any) => {
          this.allOffice = response.data
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }

  filterShift: string
  changePageSize() {
    this.paginator.pageSize = this.pageSize;
    this.dataSource.paginator = this.paginator;
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

  companyData: any
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
  selectedCompanyId: any
  onCompanySelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedCompanyId = selectedValue === "" ? "" : parseInt(selectedValue);
  }
  selectedEmployeeId: any
  onEmployeeSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedEmployeeId = selectedValue === "" ? "" : parseInt(selectedValue);
  }
  selectedDate: any
  onDateSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedDate = selectedValue === "" ? "" : selectedValue;
  }

  filterReportData(event: any) {
    const searchData = event.target.value
    this.dataSource.data = this.reportData.filter(
      report =>
        report.employee_name.toString().includes(searchData) ||
        report.name.toString().includes(searchData)
    );
  }

  departments: any
  getAllDepartment() {
    this.service.getAllDepartment().subscribe(
      (response: any) => {
        this.departments = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }

  getDepartmentById() {
    this.service.getDepartmentById(this.comapnyId).subscribe(
      (response: any) => {
        this.departments = response.data;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

}
