import { Routes } from '@angular/router';
import { ContactListComponent } from '@pages/contact-list/contact-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'contact-list', pathMatch: 'full' },
  { path: 'contact-list', component: ContactListComponent },
  {
    path: 'contact-details/:id',
    loadComponent: () =>
      import('@pages/contact-details/contact-details.component').then(
        c => c.ContactDetailsComponent
      ),
  },
  {
    path: 'contact-edit/:id',
    loadComponent: () =>
      import('@pages/contact-form/contact-form.component').then(
        c => c.ContactFormComponent
      ),
  },
  {
    path: 'contact-new',
    loadComponent: () =>
      import('@pages/contact-form/contact-form.component').then(
        c => c.ContactFormComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@pages/page-not-found/page-not-found.component').then(
        c => c.PageNotFoundComponent
      ),
  },
];
