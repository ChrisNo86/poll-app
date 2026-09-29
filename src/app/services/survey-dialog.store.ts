import { Injectable, signal } from '@angular/core';

/** Shared open/closed state for the create-survey overlay, so any page can trigger it. */
@Injectable({ providedIn: 'root' })
export class SurveyDialogStore {
  readonly isOpen = signal<boolean>(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
