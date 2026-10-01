import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

/**
 * Custom "Sort by categories" dropdown matching Figma's "Drop down & menu" component.
 *
 * A native <select>'s open option list is rendered by the OS/browser and cannot be
 * restyled cross-browser, so it can never match Figma's fully custom dark panel with a
 * pill-highlighted selected item. This component renders that panel itself.
 */
@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.scss',
})
export class CategoryDropdown {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly categories = input.required<readonly string[]>();
  readonly selected = input.required<string>();
  readonly categorySelected = output<string>();

  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected choose(category: string): void {
    this.isOpen.set(false);
    if (category !== this.selected()) {
      this.categorySelected.emit(category);
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.isOpen.set(false);
  }
}
