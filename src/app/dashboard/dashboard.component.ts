import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sideBarOpen: boolean = true;
  selectedWeek: string
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorOperations') paginatorOperations: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumn: string[] = ['department', 'currentShift', 'shiftStatus', 'attendance'];
  dataSourceOperations = new MatTableDataSource<any>([]);
  displayedOprationsColumn: string[] = ['employee', 'status', 'clock-in']
  //constructor(public service: AppService, public route: ActivatedRoute) { }
  constructor(private router: Router,public service: AppService) {
  }
  ngOnInit(): void {
    console.log(this.router.url)
    const Url  = this.router.url
  }


}
