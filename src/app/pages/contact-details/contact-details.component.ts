import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '@models/contact.interface';
import { ContactService } from '@services/contact.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PhoneCountryPipe } from '../../shared/pipes/phone-country.pipe';
import { DividerModule } from 'primeng/divider';
import { filter, Subscription, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllFavoriteContacts } from '@state/contact/contact.selectors';
import { addFavorite, removeFavorite } from '@state/contact/contact.actions';
import { AppState } from '@state/app.state';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [
    DatePipe,
    ButtonModule,
    MenuModule,
    PhoneCountryPipe,
    DividerModule,
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit, OnDestroy {
  contact: Contact | undefined;
  items: MenuItem[] | undefined;
  subscription: Subscription = new Subscription();
  isFavorite: boolean = false;

  contactService = inject(ContactService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(Store<AppState>);

  favoriteContacts$ = this.store.select(selectAllFavoriteContacts);

  ngOnInit(): void {
    const contactId = this.activatedRoute.snapshot.paramMap.get('id');

    if (contactId) {
      this.subscription.add(
        this.contactService
          .getContactById(+contactId)
          .pipe(
            tap(contact => (this.contact = contact)),
            filter(contact => !!contact),
            switchMap(contact =>
              this.favoriteContacts$.pipe(
                tap(favoriteContacts => {
                  if (contact) {
                    this.isFavorite = favoriteContacts.some(
                      favContact => favContact.id === contact.id
                    );
                  }
                })
              )
            )
          )
          .subscribe({
            error: error => console.error('Error fetching contact:', error),
          })
      );
    }

    if (!this.contact) {
      this.goBack();
    }

    this.items = [
      {
        label: 'Дії',
        items: [
          {
            label: 'Видалити',
            icon: 'pi pi-trash',
            command: () => {
              this.removeContact();
            },
          },
        ],
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/contact-list']);
  }

  editContact(contactId: number) {
    this.router.navigate(['/contact-edit', contactId]);
  }

  removeContact() {
    if (this.contact) {
      this.contactService.deleteContact(this.contact.id);
      this.goBack();
    }
  }

  addToFavorites(contact: Contact): void {
    this.store.dispatch(addFavorite({ contact }));
  }

  removeFromFavorites(contactId: number): void {
    this.store.dispatch(removeFavorite({ contactId }));
  }
}
