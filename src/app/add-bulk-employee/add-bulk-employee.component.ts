import { AfterContentChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { WorkBook, WorkSheet, AOA2SheetOpts, read, BookType, writeFile, utils } from 'xlsx';
import { LoaderService } from '../@shared/pipes';
import { ConvertArrayToObjectService } from '../@shared/pipes/convert-array-to-object.service';
import { ExcelService } from '../@shared/pipes/excel.service';
import { addEmployeeItemDto, addBulkEmployeeDto } from '../@shared/models/addEmployee.model';
import { AppService } from './../app.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../@shared/confirm.dialog';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogModel } from '../@shared/error.dialog';

@Component({
  selector: 'app-add-bulk-employee',
  templateUrl: './add-bulk-employee.component.html',
  styleUrls: ['./add-bulk-employee.component.scss']
})
export class AddBulkEmployeeComponent implements OnInit {
  isLoading!: boolean;
  duplicateFilterDataStatus: boolean = false;
  employeeData!: addEmployeeItemDto[];
  fileName: string = 'SheetJS.xlsx';
  displayedColumns: string[] = [
    'companyId',
    'name',
    'email',
    'shifts',
  ];
  dataSource: any;
  dataSourceWithPageSize: any;
  subscription!: Subscription;
  pageReloading: boolean = false;
  @ViewChild('file') inputfile: ElementRef;
  constructor(private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private arrayService: ConvertArrayToObjectService,
    private excelSrv: ExcelService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private service: AppService) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.pageReloading = !router.navigated;
        if (this.pageReloading == false) localStorage.removeItem('BulkEmpData');
      }
    });
  }

  ngOnInit(): void {
    if (typeof this.employeeData == 'undefined') {
      if (localStorage.getItem("BulkEmpData") != null) {
        this.employeeData = JSON.parse(localStorage.getItem('BulkEmpData') || '[]');
        this.dataSource = new MatTableDataSource(this.employeeData);
      }
      if (localStorage.getItem("duplicateBulkEmpData") != null) {
        let data = JSON.parse(localStorage.getItem('duplicateBulkEmpData') || '[]');
        if (data.length > 0) this.duplicateFilterDataStatus = true;
        else this.duplicateFilterDataStatus = false;
      }
    }
  }

  goto_addEmployee() {
    this.router.navigate(['/dashboard/add-employee']);
  }
  message: any
 message1: any[] = [];
  errorMeg: any
  fileUpload: any
  errorMessages: any
  onFileChange(evt: any) {
    localStorage.removeItem('duplicateBulkEmpData');
    let fileType = evt.target.files[0].type;
    if (fileType !== 'application/vnd.ms-excel' && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && fileType !== 'text/csv') {
      // this.toastr.error('Please select a valid Excel file (.XLSX or .XLS format).');
      return;
    } else {
      this.fileUpload = evt.target.files[0];
      this.service.employeeFile(this.fileUpload).subscribe((response: any) => {
        if (response) {
          // this.toastr.success(response.message);
          this.router.navigate(['/dashboard/employee']);
        }
      },
        (error) => {
          this.errorMessages = error.error.errors;
            // const errorValues = Object.values(this.errorMessages);
            // errorValues.forEach((errorMsg: any) => {
            //   const errorValues1 = Object.values(errorMsg);
            //   errorValues1.forEach((item: any) => {
            //     if (Array.isArray(item)) {
            //       const errorMessages = item.map((element: any) => {
            //         return element;
            //       });
            //       this.message1.push(...errorMessages);
            //   }
            //     });
            // });
          const dialogData = new ErrorDialogModel('Error Message',  this.errorMessages, false);
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            maxWidth: '600px',
            data: dialogData,
          });
          dialogRef.afterClosed().subscribe((data: boolean) => {
            if (data == false) {
              this.errorMessages=[];
            }
          });
          this.inputfile.nativeElement.value = null;
        }
      );
    }

  }
  //   let filteredElements: any[] = [];
  //   let errorFilteredElements: any[] = [];
  //   const filterData = (data: any) => {
  //     let value2 = '' + data[2];
  //     let value0 = '' + data[0];
  //     let value1 = '' + data[1];
  //     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value2) && /\d/.test(value0) && /^[a-zA-Z\s]+$/.test(value1)) {
  //       if (data[0] !== undefined && data[1] !== undefined && data[2] !== undefined && data[3] != undefined) {
  //         filteredElements.push(data);
  //         return true;
  //       }
  //       else {
  //         errorFilteredElements.push(data);
  //         return false;
  //       }
  //     }
  //     errorFilteredElements.push(data);
  //     return false;
  //   };
  //   this.isLoading = true;
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //   const reader: FileReader = new FileReader();
  //   reader.onload = (e: any) => {
  //     /* read workbook */
  //     const bstr: string = e.target.result;
  //     let data = <any[]>this.excelSrv.importFromFile(bstr);
  //     /* filter data not empty and regular expression*/
  //     let filteredImportedData = data.filter(filterData);
  //     let withoutFindDuplicateData = filteredImportedData;
  //     /* remove repeat data */
  //     filteredImportedData = filteredImportedData.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => (v2[2] === v[2])) === i);
  //     /* filtered duplicate data */
  //     withoutFindDuplicateData = withoutFindDuplicateData.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => (v2[2] === v[2])) !== i);
  //     /* not inserted data */
  //     withoutFindDuplicateData = withoutFindDuplicateData.filter((x: any) => x[0] != 'companyId');
  //     errorFilteredElements.push(...withoutFindDuplicateData);
  //     if (errorFilteredElements?.length > 0) {
  //       this.duplicateFilterDataStatus = true;
  //       localStorage.setItem('duplicateBulkEmpData', JSON.stringify(errorFilteredElements));
  //     }
  //     else {
  //       this.duplicateFilterDataStatus = false;
  //     }
  //     const datatosend: addBulkEmployeeDto = new addBulkEmployeeDto(filteredImportedData);
  //     if (datatosend.collection?.length <= 0) {
  //       this.isLoading = false;
  //       this.toastr.info('Enter Correct Format in Excel Sheet & Excel file should not be empty');
  //       this.inputfile.nativeElement.value = '';
  //     }
  //     this.employeeData = datatosend.collection;
  //     localStorage.setItem('BulkEmpData', JSON.stringify(this.employeeData));
  //     this.dataSource = new MatTableDataSource(this.employeeData);
  //     this.inputfile.nativeElement.value = '';
  //   };
  //   reader.readAsBinaryString(target.files[0]);
  // }

  // goto_removebulkEmployee() {
  //   this.router.navigate(['/dashboard/removeBulk-employee']);


  goto_BackPage() {
    this.location.back();
  }
}
