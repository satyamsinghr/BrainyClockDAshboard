import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<div class="lds-dual-ring" *ngIf="isLoading"></div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class SpinnerComponent {
  @Input() public isLoading = true;

  constructor() {}
}
