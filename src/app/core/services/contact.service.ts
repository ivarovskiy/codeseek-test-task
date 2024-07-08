import { inject, Injectable } from '@angular/core';
import contactList from '@mock-data/contactList.json';
import { Contact } from '@models/contact.interface';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { removeFavorite } from '@state/contact/contact.actions';
import { selectAllFavoriteContacts } from '@state/contact/contact.selectors';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>(
    this.loadContactsFromLocalStorage()
  );
  private contacts$: Observable<Contact[]> = this.contacts.asObservable();

  store = inject(Store<AppState>);
  favoriteContacts$ = this.store.select(selectAllFavoriteContacts);

  constructor() {
    if (this.contacts.getValue().length === 0) {
      this.contacts.next(contactList as Contact[]);
      this.saveContactsToLocalStorage(contactList as Contact[]);
    }
  }

  private loadContactsFromLocalStorage(): Contact[] {
    const contactsJson = localStorage.getItem('contacts');
    return contactsJson ? JSON.parse(contactsJson) : [];
  }

  private saveContactsToLocalStorage(contacts: Contact[]): void {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  getContactById(contactId: number): Observable<Contact | undefined> {
    return this.contacts$.pipe(
      map(contacts => contacts.find(contact => contact.id === contactId))
    );
  }

  getAllContacts(): Observable<Contact[]> {
    return this.contacts$;
  }

  createContact(newContact: Contact): void {
    const currentContacts = this.contacts.value;
    const maxId = Math.max(...currentContacts.map(contact => contact.id), 0);
    newContact.id = maxId + 1;
    const updatedContacts = [...currentContacts, newContact];
    this.contacts.next(updatedContacts);
    this.saveContactsToLocalStorage(updatedContacts);
  }

  deleteContact(contactId: number): void {
    const currentContacts = this.contacts.getValue();
    const updatedContacts = currentContacts.filter(
      contact => contact.id !== contactId
    );
    this.contacts.next(updatedContacts);
    this.saveContactsToLocalStorage(updatedContacts);
    this.store.dispatch(removeFavorite({ contactId }));
  }

  updateContact(contactId: number, newContact: Contact): void {
    const currentContacts = this.contacts.getValue();
    const updatedContacts = currentContacts.map(contact =>
      contact.id === contactId ? { ...contact, ...newContact } : contact
    );
    this.contacts.next(updatedContacts);
    this.saveContactsToLocalStorage(updatedContacts);
  }
}
