import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, NavigationEnd } from '@angular/router';
import { AppService } from '../app.service'

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  selectedItem: string = 'Dashboard';
  isDashboardActive: boolean = true;
  isDepartmentActive: boolean;
  isShiftActive: boolean;
  isReportsActive: boolean;
  isCompanyActive: boolean;
  isOfficeActive: boolean;
  isEmployeeActive: boolean;
  isProfileActive: boolean;
  public currentURL: any = "";
  nav_open: any = false;
  isReportFilterActive: boolean;
  constructor(private router: Router, public service: AppService) {
    this.currentURL = window.location.pathname;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardActive = event.url === '/dashboard';
        this.isDepartmentActive = event.url === '/dashboard/department';
        this.isShiftActive = event.url === '/dashboard/shift';
        this.isCompanyActive = event.url === '/dashboard/company';
        this.isOfficeActive = event.url === '/dashboard/location';
        this.isEmployeeActive = event.url === '/dashboard/employee';
        this.isReportsActive = event.url === '/dashboard/report';
        this.isProfileActive = event.url === '/dashboard/profile';
        this.isReportFilterActive = event.url.includes('/dashboard/reportFilter');
      }
    });
  }

  role: any
  ngOnInit(): void {
    this.role = this.service.getRole()
  }

   navopen() {
    this.nav_open = !this.nav_open;
    this.service.nav_active_class = this.nav_open ? 'nav_active' : '';
   }
  selectItem(item: string) {
    this.selectedItem = item;
  }

  logout() {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('companyName');
    localStorage.removeItem('nameOfCompany');
    localStorage.removeItem('comapnyId');
    localStorage.removeItem('employees');
    localStorage.removeItem(' ');
    this.router.navigateByUrl('/');
  }

}
