import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// import { SidenavComponent } from '../sidenav/sidenav.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  up_arrow: boolean = false;
  down_arrow: boolean = false;
  sort_arrow: boolean = false;
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  today: string;
  currentTime: string;
  constructor(private router: Router,
    private datePipe: DatePipe,) {
    this.sort_arrow = true;
    this.up_arrow = false;
    this.down_arrow = false;
    const currentDate = new Date();
    this.today = this.datePipe.transform(currentDate, 'EEEE, MMMM d yyyy');
    this.currentTime = this.datePipe.transform(currentDate, 'HH:mm:ss');
  }
  name:any
  role:any
  selectedData:any
  ngOnInit(): void {
    // this.selectedData=this.SidenavComponent.getSelectedItem();
     this.role = JSON.parse(localStorage.getItem('role'));
     if(this.role=='SA'){
      this.name='SuperAdmin';
     }else{
      this.name = JSON.parse(localStorage.getItem('companyName'));
     }
  }
  sort() {
    this.sort_arrow = false;
    this.up_arrow = true;
    this.down_arrow = false;
  }
  sortByAsc() {
    this.sort_arrow = false;
    this.up_arrow = false;
    this.down_arrow = true;
  }
  sortByDesc() {
    this.sort_arrow = false;
    this.up_arrow = true;
    this.down_arrow = false;
  }
  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  logout() {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('companyName');
    localStorage.removeItem('nameOfCompany');
    localStorage.removeItem('comapnyId');
    this.router.navigateByUrl('/');
  }
  // go_to_profile(){
  //   this.router.navigateByUrl('/dashboard/profile');
  // }
  openNewWindow() {
    window.open('https://brainyclock.com', '_blank');
  }
}





