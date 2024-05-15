import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppService } from '../app.service';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service'; 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // sideBarOpen: boolean = true;
  sidebarVisible: boolean = false;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorOperations') paginatorOperations: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumn: string[] = ['department', 'currentShift', 'shiftStatus', 'attendance'];
  dataSourceOperations = new MatTableDataSource<any>([]);
  displayedOprationsColumn: string[] = ['employee', 'status', 'clock-in']
  isReportPage: boolean;
  //constructor(public service: AppService, public route: ActivatedRoute) { }
  constructor(private router: Router,public service: AppService,private sharedService: SharedService) {
  }

  lastUrl:any
  ngOnInit(): void {
    const Url  = this.router.url;
    this.isReportPage = Url.includes('reportFilter');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL contains 'report'
        this.isReportPage = this.router.url.includes('reportFilter');
      }
    });
    
    this.sharedService.lastUrl$.subscribe(url => {
      this.lastUrl = url;
    });
    
    this.sharedService.sidebarVisible$.subscribe((visible: boolean) => {
      this.sidebarVisible = visible;
    });
  }


}
