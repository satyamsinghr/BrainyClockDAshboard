import { LoaderService } from 'src/app/@shared/pipes';
import { ToastrService } from 'ngx-toastr';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { } from 'googlemaps'
import { AppService } from '../../app.service';
import { EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
  isLoading = false;
  submitted = false;
  address: string = '';
  spinner: boolean = false
  addLocationForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  @ViewChild('addresstext') addresstext: any;
  @ViewChild('map') mapElement: ElementRef;
  @Output() locationAdded: EventEmitter<any> = new EventEmitter();
  map: google.maps.Map;
  marker: google.maps.Marker;
  zoomLat: any;
  zoomLong: any;
  // @ViewChild('citytext') citytext: any;
  // @ViewChild('statetext') statetext: any;
  // @ViewChild('countrytext') countrytext: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AppService,
    public dialogRef: MatDialogRef<AddLocationComponent>,
  ) { }
  role: string = '';
  isCompanyLoggedIn: boolean = false;
  companyData: any;
  companyName: any;
  name: any;
  ngOnInit(): void {
    this.initializeForm();
    this.companyName = JSON.parse(localStorage.getItem('nameOfCompany'));
    this.name = JSON.parse(localStorage.getItem('companyName'));
    this.role = this.service.getRole();
    if (this.role != 'SA') {
      this.isCompanyLoggedIn = true;
      //this.addShiftForm.get('companyId').disable();
      this.companyData = [
        {
          id: this.service.getCompanyId(),
          // name: this.service.getComapnyName(),
          name: this.companyName ? this.companyName : this.name,
        },
      ];
      this.addLocationForm.patchValue({
        companyId: this.service.getCompanyId(),
      });
    } else {
      this.getAllCompany();

    }
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
        google.maps.event.addListener(this.marker, 'dragend', (event: google.maps.MapMouseEvent) => {
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
  // Listen to marker position change
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
            this.addLocationForm.get('city').setValue(component.long_name);
          } else if (types.includes('administrative_area_level_1')) {
            // Update state
            this.addLocationForm.get('state').setValue(component.long_name);
          } else if (types.includes('postal_code')) {
            // Update pin code
            this.addLocationForm.get('pinCode').setValue(component.long_name);
          } else if (types.includes('country')) {
            // Update country
            this.addLocationForm.get('country').setValue(component.long_name);
          }
        }
      } else {
        console.error('Reverse geocode was not successful for the following reason:', status);
      }
    });
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
      geofence: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
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
      this.spinner = true
      this.submitted = false;
      this.service.addLocation(this.addLocationForm.value).subscribe(
        (response: any) => {
          this.toastr.success(response.msg);
          console.log("res", response);
          this.dialogRef.close(true);
          // this.router.navigate(['/dashboard/location']);
          // this.getLocationByCompanyId();
          this.locationAdded.emit();
          this.spinner = false
        },
        (error) => {
          this.service.handleError(error);
          this.spinner = false
        }
      );
    }
  }



  onCancel(): void {
    // Close the dialog when Cancel button is clicked
    this.dialogRef.close();
    // this.router.navigate(['/dashboard/location'])
  }
}
