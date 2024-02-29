import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { Subject } from 'rxjs';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss'],
})
export class EditLocationComponent implements OnInit {
  isLoading = false;
  editLocationForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  @ViewChild('addresstext') addresstext: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
    private route: ActivatedRoute
  ) {}

  locationId: any;
  role: string = '';
  isCompanyLoggedIn: boolean = false;
  companyData: any;
  submitted = false;
  disableSelect: boolean = false;

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.initializeForm();
    this.role = this.service.getRole();
    if (this.role != 'SA') {
      this.isCompanyLoggedIn = true;
      //this.addShiftForm.get('companyId').disable();
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          name: this.service.getComapnyName(),
        },
      ];
      this.editLocationForm.patchValue({
        companyId: this.service.getCompanyId(),
      });
    } else {
      this.getAllCompany();
    }
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
    this.getLocationById(this.locationId);
  }

  initializeForm() {
    this.editLocationForm = this.fb.group({
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
    return this.editLocationForm.get('shifts');
  }

  changeShift(e: any) {}
  get editLocationFormControl() {
    return this.editLocationForm.controls;
  }

  gotoEmpPage() {
    this.router.navigate(['/dashboard/location']);
  }
  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getLocationById(id: number) {
    this.service.getLocationById(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.editLocationForm.patchValue({
            location_name: response.data.location_name,
            address: response.data.address,
            city : response.data.city,
            state : response.data.state,
            country : response.data.country,
            companyId: response.data.company_id,
            pinCode: response.data.pincode,
            latitude : response.data.latitude,
            longitude : response.data.longitude
          });
        }
      },
    });
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

  editLocation() {
    this.submitted = true;
    if (this.editLocationForm.valid) {
      this.submitted = false;
      this.service
        .editLocation(this.editLocationForm.value, this.locationId)
        .subscribe(
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
            this.editLocationForm.controls['pinCode'].patchValue(component.long_name);
            break;
          }

          case "administrative_area_level_3": {
            this.editLocationForm.controls['city'].patchValue(component.long_name);
            break;
          }
          case "administrative_area_level_1": {
            this.editLocationForm.controls['state'].patchValue(component.long_name);
            break;
          }
    
          case "country":
            this.editLocationForm.controls['country'].patchValue(component.long_name);
            break;
        }
      }

      this.editLocationForm.controls['latitude'].setValue(place.geometry.location.lat().toString());
      this.editLocationForm.controls['longitude'].setValue(place.geometry.location.lng().toString());
    });
  }
}
