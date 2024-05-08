import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { } from 'googlemaps'
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'angular-highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppService } from '../app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sideBarOpen: boolean = true;
  selectedWeek: string
  nameOfCompany = JSON.parse(localStorage.getItem('nameOfCompany'));
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorOperations') paginatorOperations: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumn: string[] = ['department', 'shiftStatus', 'attendance'];
  dataSourceOperations = new MatTableDataSource<any>([]);
  displayedOprationsColumn: string[] = ['employee','shiftName' ,'status', 'clock-in']
  @ViewChild('map') mapElement: any;
  @ViewChild('addresstext') addresstext: any;
  map!: google.maps.Map;
  autocompleteInput !: string;
  companyId: number;
  role: any;
  locations: any;
  zoomLat: any;
  zoomLong: any;
  formattedDate: string;
  dayName: string;
  dayRatios: any = {
    Sunday : 0,
    Monday : 0,
    Tuesday : 0,
    Wednesday : 0,
    Thursday : 0,
    Friday : 0,
    Saturday : 0
  };
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private service: AppService,
    private toastr: ToastrService,
  ) {
    const currentDate = new Date();
    this.formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    console.log('formattedDate', this.formattedDate);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = currentDate.getDay();
    this.dayName = dayNames[dayIndex];
    //  this.selectedDays.push(this.dayName);
  }
  
  token: any;
  selectedDays: string[] = [];
  presentDate: any;
  selectedCompanyId:number;
  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('loginToken'));
    this.selectedCompanyId = JSON.parse(localStorage.getItem('comapnyId'));
    if(this.token == null){
      this.router.navigateByUrl('/');
    }
    else{
      this.role = this.service.getRole();
      this.companyId = this.service.getCompanyId();

      this.getEmployeeCount();
      this.getDepaetmentById();
      this.getEmployeeByCompanyId();
      this.getAllLocation();
      this.getLocationByCompanyId();
      const todayDate = new Date();
      this.presentDate = moment(todayDate).format('YYYY-MM-DD');
      this.getAttendanceByCompanyId(this.presentDate);
    }
  }
  public qrCodeDownloadLink: any = "www.google.com";
   onChangeURL(url: any) {
    this.qrCodeDownloadLink = url;
  }

  getStatus(createdDate: any) {
    const currentTime = new Date();
    const formattedCreatedDate = moment(currentTime).format('YYYY-MM-DD');
    if (createdDate == formattedCreatedDate && createdDate == null) {
      return 'Inprogress';
    } else {
      return 'NA';
    }
  }

  onSelectWeek(day: string) {
    const selectedDate = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = dayNames.indexOf(day);
    if (dayIndex <= selectedDate.getDay()) {
      this.dayName = day;
      const daysToAdd = dayIndex - selectedDate.getDay();
      const selectedDateWithDay = new Date(selectedDate);
      selectedDateWithDay.setDate(selectedDate.getDate() + daysToAdd);
      this.formattedDate = selectedDateWithDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const formattedCurrentDate = moment(selectedDateWithDay).format('YYYY-MM-DD')
      this.getAttendanceByCompanyId(formattedCurrentDate);
    }
    // else {
    //   this.toastr.error('You cannot select a future day.');
    // }
  }

  attandanceCount: any;
  attendanceByDate: any;
  getAttendanceByCompanyId(formattedCurrentDate: any) {
    if (this.role != 'SA') {
      this.service.getAttendanceByCompanyId(this.companyId).subscribe(
        (response: any) => {
          const formattedData = response.map((x: any) => ({
            ...x,
            created_at: moment(x.created_at).format('YYYY-MM-DD'),
            day: moment(x.created_at).format('dddd')
          }));
          this.attendanceByDate = formattedData.filter(
            (x: any) => x.created_at === formattedCurrentDate
          );
          console.log("attendanceByDate", this.attendanceByDate);


          const groupedData = formattedData.reduce((acc: any, entry: any) => {
            const day = entry.day;
            if (!acc[day]) {
              acc[day] = [];
            }
            acc[day].push(entry);
            return acc;
          }, {});

          console.log(groupedData);
          const dayCounts: Record<string, number> = {};
          for (const day in groupedData) {
            if (groupedData.hasOwnProperty(day)) {
              const entries = groupedData[day];
              const count = entries.filter((entry: any) => entry.clock_in_time !== null).length;
              dayCounts[day] = count;
            }
          }

          // this.dayRatios = {};

          for (const day in dayCounts) {
            if (dayCounts.hasOwnProperty(day)) {
              const count = dayCounts[day];
              const ratio = (count / this.employeelength) * 100;
              this.dayRatios[day] = ratio;
            }
          }
          this.attandanceCount = this.getCountsOfClockInTime();
          this.initDonut();
          // this.dataSourceOperations.data = formattedData;

        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }

  getDayClass(day: any): string {
    const currentDate = new Date();
    const currentDay = moment(currentDate).format('dddd').toLowerCase();
    if (day.toLowerCase() === currentDay) {
      return 'today';
    } else if (day > currentDay) {
      return 'upcoming_day';
    } else {
      return '';
    }
  }

  calculateProgressBarValue(attendedEmp: number, totalEmployees: number): number {
    // Ensure that totalEmployees is not 0 to avoid division by zero
    const ratio = totalEmployees !== 0 ? (attendedEmp / totalEmployees) * 100 : 0;
    return ratio;
  }
  
  // pageEvent: PageEvent;

  // onPageChange(event: any) {

  //   if (event.previousPageIndex < event.pageIndex) {
  //     // User clicked on next button
  //     this.index++;
  //   } else {
  //     // User clicked on previous button
  //     this.index--;
  //   }
  //   // Ensure index does not go out of bounds
  //   this.index = Math.max(0, Math.min(this.dataSourceOperations.data.length - 1, this.index));
  //   // Update paginator
  //   this.paginatorOperations.pageIndex = this.index;
  // }

  departmentId:any
  departmentData: any;
  departmentName:any;
  departmentName1:any;
  index :any = 0;
  newFilteredArray: [] 
  getDepaetmentById() {
    this.service.getDepartmentById(this.selectedCompanyId).subscribe(
      (response: any) => {
        this.departmentData = response.data;
        this.departmentId=this.departmentData[this.index].department_id;
        console.log("departmenytId",this.departmentId);
        this.departmentName=this.departmentData[this.index].department_name;
        this.departmentName1=this.departmentData[this.index1].department_name;
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }
  
  employeelength: any
  employee:[]
  department_id:any
  getEmployeeByCompanyId() {
    if (this.role != 'SA') {
      this.service.getAllEmployeeByCompany().subscribe(
        (response: any) => {
          this.employeelength = response.data.length;
          this.employee=response.data;
         this.filterEmployeeDataByDepartmentId() ;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }

  filteredEmployees: any[] = [];
  filterEmployeeDataByDepartmentId() {
    if (this.departmentId && this.employee) {
     this.filteredEmployees = this.employee.filter((emp:any) => parseInt(emp.department_id) == this.departmentId);
     console.log("hshshshhshhsjs",this.filteredEmployees)
     this.dataSourceOperations.data = this.filteredEmployees;
    }
  }



forwardButtonClick() {
    if (this.index < this.departmentData.length-1) {
        this.index++;
        this.updateDepartmentName();
        this.departmentId=this.departmentData[this.index].department_id;
        this.filterEmployeeDataByDepartmentId();
    }
}

backwardButtonClick() {
    if (this.index > 0) {
        this.index--;
        this.updateDepartmentName();
        this.departmentId=this.departmentData[this.index].department_id
        ;
        this.filterEmployeeDataByDepartmentId()
    }
}

updateDepartmentName() {
    // Update the department name based on the current index
    this.departmentName = this.departmentData[this.index]?.department_name || '';
}


index1:number=0;

forwardButtonClick1() {
  if (this.index1 < this.departmentData.length-1) {
      this.index1++;
      this.updateDepartmentName1();
  }
}

backwardButtonClick1() {
  if (this.index1 > 0) {
      this.index1--;
      this.updateDepartmentName1();
  }
}

updateDepartmentName1() {
  this.departmentName1 = this.departmentData[this.index1]?.department_name || '';
}

employeeCount: any
  getEmployeeCount() {
    if (this.role != 'SA') {
      this.service.getEmployeeCount().subscribe(
        (response: any) => {
          // this.employeeCount = response.data;
           this.dataSource.data = response.data;
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }

  getCountsOfClockInTime(): { onTime: number, late: number } {
    const counts = {
      onTime: 0,
      late: 0
    };

    this.attendanceByDate.forEach((attendance: any) => {
      const clockInTime = attendance.clock_in_time;
      if (clockInTime) {
        const momentClockInTime = moment(clockInTime, 'HH:mm:ss');
        if (momentClockInTime.isBefore(moment('09:30:00', 'HH:mm:ss'))) {
          counts.onTime++;
        } else {
          counts.late++;
        }
      }
    });

    return counts;
  }

  getRowClass(element: any): string {
    // Customize this logic based on your requirements
    if (element.clock_in_time <= '09:30:00') {
      return 'late_punch';
    } else if (element.clock_in_time == null) {
      return 'absent';
    } else {
      return '';
    }
  }

  locationData: any
  getLocationByCompanyId() {
    this.service.getLocationByCompany(this.companyId).subscribe(
      (response: any) => {
        this.locationData = response.data[0];
      },
      (error) => {
        this.service.handleError(error);
      }
    );
  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  donutChart: any
  initDonut() {
    const donut = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        height: 240,
      },

      credits: {
        enabled: false
      },
      title: {
        text: '',
      },
      plotOptions: {
        pie: {
          borderColor: null,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
          colors: ['#FF6528', '#061D23'],
        }
      },
      series: [
        {
          name: 'Browsers',
          data: [
            {
              name: 'On Time',
              // y: 43
              y: this.attandanceCount?.onTime ? this.attandanceCount?.onTime : 0,
            },
            {
              name: 'Late',
              // y: 7,
              y: this.attandanceCount?.late ? this.attandanceCount?.late : 0,
            }],
          type: 'pie',
          innerSize: '75%',
        }]
    });
    this.donutChart = donut;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSourceOperations.paginator = this.paginatorOperations
    //  this.zoomLat = 10.5937;
    //   this.zoomLong = 28.9629;
    const mapProperties = {
      center: new google.maps.LatLng(this.zoomLat, this.zoomLong),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
  }

  getAllLocation() {
    if (this.role == 'SA') {
      this.service.getAllLocation().subscribe(
        (response: any) => {
          this.locations = response.data;
          this.getAddress(this.locations)
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    } else { // this.getLocationByCompanyId();
      this.service.getLocationByCompany(this.companyId).subscribe(
        (response: any) => {
          this.locations = response.data;
          this.getAddress(this.locations)
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }

  getAddress(locations: any) {
    if (locations && locations.length > 0) {
      let loc = locations.filter((x: any) => x.latitude != null && x.longitude != null);
      if (loc && loc.length > 0) {
        this.zoomLat = loc[0].latitude;
        this.zoomLong = loc[0].longitude;
        this.ngAfterViewInit()
      } else {
        this.zoomLat = 20.5937;
        this.zoomLong = 78.9629;
        this.ngAfterViewInit()
      }
    }

    for (let place of locations) {
      if (place.latitude && place.longitude) {
        let data = { lat: Number(place.latitude), lng: Number(place.longitude) }
        let marker = new google.maps.Marker({
          position: data,
          map: this.map,
          title: 'marker',
        });

        marker.addListener('click', () => {
          this.handleMarkerClick(place.company_id, place.id);
        });

        let infowindow = new google.maps.InfoWindow({
          content: `<div style="color: black;"><h6>Office Name</h6><span>${place.location_name}</span></div>`,
          disableAutoPan: true
        });

        marker.addListener("mouseover", () => {
          infowindow.open(this.map, marker);
          //infowindow.setContent(place.location_name);
        });
        marker.addListener("mouseout", () => {
          infowindow.close();
        });
      }
    }
  }

  handleMarkerClick(comapnyId: number, id: number) {
    this.router.navigate(['/dashboard/employee'], {
      relativeTo: this.route,
      queryParams: { companyId: comapnyId, locationId: id }
    });
  }

}
