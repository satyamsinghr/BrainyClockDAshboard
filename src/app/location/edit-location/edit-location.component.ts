import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Inject } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss'],
})
export class EditLocationComponent implements OnInit {
  isLoading = false;
  locationId: number;
  editLocationForm!: FormGroup;
  address: string = '';
  protected _onDestroy = new Subject<void>();
  @ViewChild('addresstext') addresstext: any;
  @ViewChild('map') mapElement: ElementRef;
  @Output() locationEdit: EventEmitter<any> = new EventEmitter();
  map: google.maps.Map;
  marker: google.maps.Marker;
  zoomLat: any;
  zoomLong: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<EditLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { locationId: number }
  ) { 
    this.locationId = data.locationId;
  }

  // locationId: any;
  role: string = '';
  isCompanyLoggedIn: boolean = false;
  companyData: any;
  submitted = false;
  disableSelect: boolean = false;

  ngOnInit(): void {
    // this.locationId = this.route.snapshot.params['locationId'];
    // this.getLocationById(this.locationId);
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
    this.locationId = this.data.locationId;
    this.getLocationById(this.locationId);  

  }

  ngAfterViewInit(): void {
    this.getPlaceAutocomplete();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const mapProperties = {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
        // Initialize marker here
        this.marker = new google.maps.Marker({
          map: this.map,
          position: mapProperties.center,
          draggable: true // if you want the marker to be draggable
        });
        // Listen to marker drag end event
        google.maps.event.addListener(this.marker, 'dragend', (event) => {
          this.onMarkerDragEnd(event);
        });
      }, () => {
        // Handle errors here
        console.error("Error: The Geolocation service failed.");
      });
    } else {
      console.error("Error: Your browser doesn't support Geolocation.");
    }
  }


  onAddressChange(): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        this.map.setCenter(location);
        // Update marker position
        this.marker.setPosition(location);
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }


  // Update marker position based on address
  geocodeAddress(address: string): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        this.marker.setPosition(location);
        this.map.setCenter(location);
        // Update form fields if needed
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }
  onMarkerDragEnd(event: google.maps.MouseEvent): void {
    const position = event.latLng;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results[0]) {
        // Update address field
        this.address = results[0].formatted_address;
        // Update form fields based on the address
        for (const component of results[0].address_components) {
          const types = component.types;
          if (types.includes('locality')) {
            // Update city
            if (component.long_name)
              this.editLocationForm.get('city').setValue(component.long_name);
            else
              this.editLocationForm.get('city').setValue('');
          } else if (types.includes('administrative_area_level_1')) {
            // Update state
            this.editLocationForm.get('state').setValue(component.long_name);
          } else if (types.includes('postal_code')) {
            // Update pin code
            this.editLocationForm.get('pinCode').setValue(component.long_name);
          } else if (types.includes('country')) {
            // Update country
            this.editLocationForm.get('country').setValue(component.long_name);
          }
        }
      } else {
        console.error('Reverse geocode was not successful for the following reason:', status);
      }

    });
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
      geofence: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
  }
  get shiftName() {
    return this.editLocationForm.get('shifts');
  }

  changeShift(e: any) { }
  get editLocationFormControl() {
    return this.editLocationForm.controls;
  }

  // gotoEmpPage() {
  //   this.router.navigate(['/dashboard/location']);
  // }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getLocationById(locationId: number) {
    this.service.getLocationById(locationId).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.address = response.data.address;
          this.editLocationForm.patchValue({
            location_name: response.data.location_name,
            address: response.data.address,
            city: response.data.city,
            state: response.data.state,
            country: response.data.country,
            companyId: response.data.company_id,
            geofence: response.data.geofence_radius,
            pinCode: response.data.pincode,
            latitude: response.data.latitude,
            longitude: response.data.longitude
          });
          this.geocodeAddress(this.address);
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

  spinner: boolean = false
  editLocation() {
    this.spinner = true
    this.submitted = true;
    if (this.editLocationForm.valid) {
      this.submitted = false;
      this.service
        .editLocation(this.editLocationForm.value, this.locationId)
        .subscribe(
          (response: any) => {
            this.toastr.success(response.msg);
            this.dialogRef.close();
            this.locationEdit.emit();
            this.spinner = false
            // this.router.navigate(['/dashboard/location']);
          },
          (error) => {
            this.service.handleError(error);
            this.spinner = false
          }
        );
    }
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.address = place.formatted_address;
      // Call onAddressChange() function
      this.onAddressChange();
      let address1 = "";  
      let postcode = "";
  
      if (!place.address_components.some(x => x.types.includes("administrative_area_level_3")))
        this.editLocationForm.controls['city'].patchValue('');


      if (!place.address_components.some(x => x.types.includes("administrative_area_level_1")))
        this.editLocationForm.controls['state'].patchValue('');


      if (!place.address_components.some(x => x.types.includes( "postal_code")))
        this.editLocationForm.controls['pincode'].patchValue('');


      if (!place.address_components.some(x => x.types.includes( "country")))
        this.editLocationForm.controls['country'].patchValue('');


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
    // this.onAddressChange();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
