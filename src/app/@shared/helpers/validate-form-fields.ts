import { FormGroup, FormControl, FormArray } from '@angular/forms';

export function ValidateAllFormFields(formGroup: FormGroup) {
  //{1}
  Object.keys(formGroup.controls).forEach((field) => {
    //{2}
    const control = formGroup.get(field); //{3}
    if (control instanceof FormControl) {
      //{4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      //{5}
      ValidateAllFormFields(control); //{6}
    }
  });
}

/**
 * Force validation on all form group inside form array
 * @param control FormArray
 */
export function validateForce(control: FormArray) {
  control.controls.map((e: any) => {
    if (e.invalid) ValidateAllFormFields(e);
  });
}

