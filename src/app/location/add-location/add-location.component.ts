import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { Subject } from 'rxjs';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
  isLoading = false;
  submitted = false;
  addLocationForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  @ViewChild('addresstext') addresstext: any;
  // @ViewChild('citytext') citytext: any;
  // @ViewChild('statetext') statetext: any;
  // @ViewChild('countrytext') countrytext: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService
  ) { }
  role: string = '';
  isCompanyLoggedIn: boolean = false;
  companyData: any;
  companyName: any;
  name: any;
  ngOnInit(): void {
    this.initializeForm();
    this.companyName=JSON.parse(localStorage.getItem('nameOfCompany'));
    this.name=JSON.parse(localStorage.getItem('companyName'));
    this.role = this.service.getRole();
    if (this.role != 'SA') {
      this.isCompanyLoggedIn = true;
      //this.addShiftForm.get('companyId').disable();
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          // name: this.service.getComapnyName(),
          name: this.companyName?this.companyName:this.name,
        },
      ];
      this.addLocationForm.patchValue({
        companyId: this.service.getCompanyId(),
      });
    } else {
      this.getAllCompany();
    }
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      let address1 = "";
      let postcode = "";

      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        // @ts-ignore remove once typings fixed
        const componentType = component.types[0];
    
        switch (componentType) {

          case "postal_code": {
            this.addLocationForm.controls['pinCode'].patchValue(component.long_name);
            break;
          }

          case "administrative_area_level_3": {
            this.addLocationForm.controls['city'].patchValue(component.long_name);
            break;
          }
          case "administrative_area_level_1": {
            this.addLocationForm.controls['state'].patchValue(component.long_name);
            break;
          }
    
          case "country":
            this.addLocationForm.controls['country'].patchValue(component.long_name);
            break;
        }
      }

      this.addLocationForm.controls['latitude'].setValue(place.geometry.location.lat().toString());
      this.addLocationForm.controls['longitude'].setValue(place.geometry.location.lng().toString());
    });
  }

  initializeForm() {
    this.addLocationForm = this.fb.group({
      location_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      companyId: [''],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
  }
  get shiftName() {
    return this.addLocationForm.get('shifts');
  }

  changeShift(e: any) { }
  get addLocationFormControl() {
    return this.addLocationForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/location']);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

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

  addLocation() {
    this.submitted = true;
    if (this.addLocationForm.valid) {
      this.submitted = false;
      this.service.addLocation(this.addLocationForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          this.router.navigate(['/dashboard/location']);
        },
        (error) => {
          this.service.handleError(error);
        }
      );
    }
  }
}
