import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Page header with the linked logo. Content projected into it is shown on the right. */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly variant = input<'light' | 'dark'>('light');
}
