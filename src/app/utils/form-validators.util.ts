import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Fails if the value is empty or only whitespace. */
export function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { blank: true };
}

/** Fails if a given yyyy-MM-dd date lies before today. Empty values are valid. */
export function notInPast(control: AbstractControl<string>): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const endOfDay = parseDateInput(control.value);
  return endOfDay > Date.now() ? null : { inPast: true };
}

/** Converts a yyyy-MM-dd string to the last millisecond of that local day. */
export function parseDateInput(value: string): number {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59).getTime();
}

/** Returns true if a control is invalid and the user has interacted with it. */
export function showsError(control: AbstractControl): boolean {
  return control.invalid && (control.touched || control.dirty);
}
