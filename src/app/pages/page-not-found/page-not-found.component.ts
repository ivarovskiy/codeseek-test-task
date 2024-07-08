import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/contact-list']);
  }
}
