import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../@shared/pipes';
import { ConvertArrayToObjectService } from '../@shared/pipes/convert-array-to-object.service';
import { ExcelService } from '../@shared/pipes/excel.service';
import { addEmployeeItemDto } from '../@shared/models/addEmployee.model';

@Component({
  selector: 'app-remove-bulk-employee',
  templateUrl: './remove-bulk-employee.component.html',
  styleUrls: ['./remove-bulk-employee.component.scss']
})
export class RemoveBulkEmployeeComponent implements OnInit {
  isLoading!: boolean;
  employeeData!: addEmployeeItemDto[];
  duplicateData: any[] = [];
  fileName: string = 'SheetJS.xlsx';
  displayedColumns: string[] = [
    'companyId',
    'name',
    'email',
    'shifts',
  ]
  dataSource: any;
  dataSourceWithPageSize: any;
  constructor(private router: Router,private location: Location, private toastr: ToastrService, private loader: LoaderService, private arrayService:ConvertArrayToObjectService) {
    if (localStorage.getItem("duplicateBulkEmpData") != null) {
      var data = JSON.parse(localStorage.getItem('duplicateBulkEmpData') || '[]');
      this.employeeData = this.arrayService.convertToArrayOfObjects(data);
    }
  }
  ngOnInit(): void {
  }
  goto_BackPage(){
    this.location.back();
  }
}
