import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
// import { AppService } from './../app.service';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
// import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { SharedService } from 'src/app/shared.service';
moment.locale("fr");
@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss']
})
export class ReportFilterComponent implements OnInit {

  @ViewChild('addPopup') addPopup: any;

  myForm: FormGroup;

  companyId: number
  role: any
  dataSource = new MatTableDataSource<any>([]);
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
    private fb: FormBuilder,
    private sharedService:SharedService
    // private modalService: NgbModal,
  ) { this.alwaysShowCalendars = true; }

  reportData: any[]
  filterDepartment: any
  filterOffice: any
  comapnyId: any
  token: any
  shifts: any = []
  pageSize: number = 10;
  reportNameError: boolean = false;
  isModelOpen: boolean = false;
  show_modal: string = '';
  startDate: any
  endDate: any
  selectedCompanyId: any;
  selectedLocation: any
  locationName: string = 'Select Location';
  selectedReportType: string = 'Select ReportType';

  ngOnInit(): void {
    const Url  = this.router.url;
    console.log("testtt",Url);
    
    const parts = Url.split('/');
    this.lastUrl = parts[parts.length - 1];
    this.sharedService.setLastUrl(this.lastUrl);
    console.log("LastURL",this.lastUrl)
    this.createForm();
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    if (this.token == null) {
      this.router.navigateByUrl('/');
    }
    else {
      this.role = this.service.getRole();
      this.companyId = this.service.getCompanyId()
      this.comapnyId = JSON.parse(localStorage.getItem('comapnyId'));
      this.role == 'SA' ? this.getReports() : this.getReportByCompany()
      this.role == 'SA' ? this.getAllDepartment() : this.getDepartmentById()
      this.getAllShift()
      this.getLocationByCompanyId();
      this.getAllLocation()
    }
  }
  selected: { startDate: moment.Moment, endDate: moment.Moment } = {
    startDate: moment(),
    endDate: moment()
  };
  alwaysShowCalendars: boolean;
 
  locale: any = {
    applyLabel: 'Save',
    cancelLabel: 'Cancel',
    customRangeLabel: 'Custom Range',
  };
  ranges: any = {
    'Week to Date': [moment().startOf('week'), moment()],
    'Month to Date': [moment().startOf('month'), moment()],
    'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  };

  goto_report() {
    this.router.navigate(['/dashboard/report']);
  }

  createForm() {
    this.myForm = this.fb.group({
      reportName: ['', [Validators.required]],
      reportType: [''],
      location: [''],
      dateReport: [''],
    });
  }

  get selectedDepartments() {
    return this.myForm.get('selectedDepartments') as FormGroup;
  }

  get selectedShifts() {
    return this.myForm.get('selectedShifts') as FormGroup;
  }

  onChangeDate(event: any) {
    this.startDate = this.datePipe.transform(event.startDate.$d, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(event.endDate.$d, 'yyyy-MM-dd');
  }
  onSubmit() {
    if (!this.myForm.value.reportName) {
      this.reportNameError = true;
      return;
    } else {
      this.isModelOpen = true;
      this.show_modal = 'show'
      this.loading = true;
      if (this.role !== "SA") {
        this.selectedCompanyId = this.service.getCompanyId();
        this.service.filterReport(this.reportNameValue, this.selectedCompanyId, this.selectedReportType, this.startDate, this.endDate, this.selectedLocation, this.selectedDepartmentIds, this.selectedShift).subscribe((response: any) => {
          this.generatedReports = response.body.data.records;
          this.reportName = response.body.data.reportName;
          this.reportType = response.body.data.reportType;
          this.loading = false;
          this.resetFields();
          this.myForm.reset();
        },
          (error) => {
            this.service.handleError(error);
            this.loading = false;
            this.show_modal = '';
          });
      }
    }

  }
  resetFields() {
    this.reportNameError = false;
    this.reportNameValue = null;
    this.selectedLocation = null;
    this.locationName = 'Select Location';
    this.selectedReportType = 'Select ReportType';
    this.selectedDepartmentIds = [];
    this.selectedDepartmentNames = [];
    this.selectedShift.splice(0, this.selectedShift.length);
    this.selected = {startDate: moment(), endDate: moment()};
  }

  onDateRangeSelection(event: any, date: any) {
    const selectedDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
    if (date === 'startDate') {
      this.startDate = selectedDate;
    } else {
      this.endDate = selectedDate;
    }

    // if (this.startDate || this.endDate) {
    //   this.dataSource.data = this.reportData.filter(item => {
    //     const createdAtDate = new Date(item.created_at).toISOString().split('T')[0];
    //     return (
    //       (!this.startDate || createdAtDate >= this.startDate) &&
    //       (!this.endDate || createdAtDate <= this.endDate)
    //     );
    //   });
    // }
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

  reportNameValue: any
  onReportNameChange() {
    this.reportNameValue = this.myForm.get('reportName').value;
  }

  onLocationChange(data: any, locationName: any) {
    this.selectedLocation = data;
    this.locationName = locationName;
  }

  onReportTypeChange(data: any) {
    this.selectedReportType = data;
  }

  // selectedDepartmentIds: number[] = [];
  // selectedDepartmentNames: string[] = [];
  // selectAllChecked = false;
  // toggleDepartmentSelection(departmentId: number) {
  //   if (this.selectedDepartmentIds.includes(departmentId)) {
  //     this.selectedDepartmentIds = this.selectedDepartmentIds.filter(id => id !== departmentId);
  //   } else {
  //     this.selectedDepartmentIds.push(departmentId);
  //   }
  // }
  searchInput: string = '';
  filteredDepartments: any[] = [];

  selectedDepartmentIds: number[] = [];
  selectedDepartmentNames: string[] = [];
  selectAllChecked = false;

  toggleSelectAll() {
    if (this.selectAllChecked) {
      this.selectedDepartmentIds = [];
      this.selectedDepartmentNames = [];
    } else {
      this.selectedDepartmentIds = this.departments.map((dep: any) => dep.department_id);
      this.selectedDepartmentNames = this.departments.map((dep: any) => dep.department_name);
    }
    this.selectAllChecked = !this.selectAllChecked;
  }
  
  toggleDepartmentSelection(departmentId: number) {
    const departmentIndex = this.selectedDepartmentIds.indexOf(departmentId);
    if (departmentIndex !== -1) {
      this.selectedDepartmentIds = this.selectedDepartmentIds.filter((id) => id !== departmentId);
      this.selectedDepartmentNames = this.selectedDepartmentNames.filter(
        (name, index) => index !== departmentIndex
      );
    } else {
      const department = this.departments.find((dep: any) => dep.department_id === departmentId);
      if (department) {
        this.selectedDepartmentIds.push(departmentId);
        this.selectedDepartmentNames.push(department.department_name);
      }
    }
  
    this.selectAllChecked =
      this.selectedDepartmentIds.length === this.departments.length ? true : false;
  }
  filterDepartments() {
    this.filteredDepartments = this.departments.filter(
      (department: { department_name: string; }) =>
        department.department_name.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }


  allShifts: any[] = [];
  selectedShift: number[] = [];
  onCheckboxChange(shiftId: number, event: Event) {
    event.stopPropagation();
    if (this.selectedShift.includes(shiftId)) {
      this.selectedShift = this.selectedShift.filter(id => id !== shiftId);
    } else {
      this.selectedShift.push(shiftId);
    }
  }
  generatedReports: any
  loading: boolean = false;
  reportName: any
  reportType: any

  // filterReport() {
  //   this.loading = true;
  //   if (this.role !== "SA") {
  //     this.selectedCompanyId = this.service.getCompanyId();
  //     this.service.filterReport( this.reportNameValue, this.selectedCompanyId, this.selectedReportType,this.startDate,this.endDate,this.selectedLocation,this.selectedDepartmentIds,this.selectedShift ).subscribe((response: any) => {
  //       this.generatedReports= response.body.data.records;
  //       this.reportName=response.body.data.reportName;
  //       this.reportType=response.body.data.reportType;
  //       this.loading = false; 
  //       this.resetFields();
  //       this.myForm.reset();
  //   },
  //       (error) => {
  //        this.service.handleError(error);
  //         this.loading = false; 
  //       });
  //   }
  // }

  downloadExcelReport() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    this.addBoldTextRow(worksheet, 'Report Name:', this.reportName ? this.reportName : "");
    this.addBoldTextRow(worksheet, 'Report Type:', this.reportType ? this.reportType : "");

    worksheet.addRow([]);

    const excelData = this.generateExcelData(this.generatedReports);
    worksheet.addRow(excelData[0]);
    for (let i = 1; i < excelData.length; i++) {
      worksheet.addRow(excelData[i]);
    }
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'generated_reports.xlsx');
      this.show_modal = '';
    });
  }
  addBoldTextRow(worksheet: any, label: string, value: string) {
    const boldStyle = { bold: true };

    worksheet.addRow([label, value]).eachCell((cell: any) => {
      cell.font = boldStyle;
    });
  }

  getDepartmentById() {
    this.service.getDepartmentById(this.comapnyId).subscribe(
      (response: any) => {
        this.departments = response.data;
        this.filterDepartments();
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  downloadCSVReport() {
    const csvContent = [];
    csvContent.push(['Report Name', this.reportName ? this.reportName : ""]);
    csvContent.push(['Report Type', this.reportType ? this.reportType : ""]);
    csvContent.push([]);
    const excelData = this.generateExcelData(this.generatedReports);
    for (let i = 0; i < excelData.length; i++) {
      csvContent.push(excelData[i]);
    }
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'generated_reports.csv';
    link.click();
    this.show_modal = '';
  }
  closeModal(){
    this.show_modal = ''; 
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


  onDepartmentSelect(event: any) {
    this.filterDepartment = event.target.value
    if (event.target.value) {
      this.dataSource.data = this.reportData.filter(
        report => report.department_name === this.filterDepartment
      );
    }
    else {
      this.dataSource.data = this.reportData
    }
  }

  onOfficeSelect(event: any) {
    this.filterOffice = event.target.value;
    if (event.target.value) {
      this.filterOffice = event.target.value
      this.dataSource.data = this.reportData.filter(
        report => report.location_name === this.filterOffice
      );
    }
    else {
      this.dataSource.data = this.reportData
    }

  }

  onShiftSelect(event: any) {
    this.filterShift = event.target.value
    if (event.target.value) {
      this.dataSource.data = this.reportData.filter(
        report =>
          report.shift_name === this.filterShift
      );
    }
    else {
      this.dataSource.data = this.reportData
    }
  }

  // applyFilter() {
  //   if (this.filterOffice || this.filterDepartment || this.filterShift) {
  //     this.dataSource.data = this.reportData.filter(report =>
  //       (!this.filterDepartment || report.department_id === this.filterDepartment) ||
  //       (!this.filterShift || report.shift_name === this.filterShift) ||
  //       (!this.filterOffice || report.location_name === this.filterOffice)
  //     );
  //   } else {
  //     this.dataSource.data = this.reportData;
  //   }
  // }

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

  getReportByCompany() {
    this.spinner.show();
    this.service.getReportByCompany(this.companyId).subscribe((response: any) => {
      this.spinner.hide();
      this.reportData = response.data
      this.dataSource.data = response.data
    },
      (error) => {
        this.service.handleError(error);
      })
  }

  getReports() {
    this.spinner.show();
    this.service.getAllReports().subscribe((response: any) => {
      this.spinner.hide();
      this.reportData = response.data
      this.dataSource.data = response.data
    },
      (error) => {
        this.service.handleError(error);
      })
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

}
