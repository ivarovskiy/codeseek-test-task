import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Contact } from '@models/contact.interface';
import { AutoCompleteModule } from 'primeng/autocomplete';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Input() contacts!: Contact[];
  @Output() selectedContact = new EventEmitter<Contact>();

  modifiedContacts!: Contact[];

  formGroup!: FormGroup;
  numberOfContacts!: string;
  filteredContacts!: Contact[];

  ngOnInit(): void {
    this.modifiedContacts = this.contacts.map(contact => ({
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
    }));

    this.numberOfContacts = `${this.modifiedContacts.length} контактів`;

    this.formGroup = new FormGroup({
      selectedContact: new FormControl<object | null>(null),
    });

    if (this.formGroup.valid) {
      this.formGroup
        .get('selectedContact')
        ?.valueChanges.subscribe((contact: Contact | null) => {
          if (contact) {
            this.selectedContact.emit(contact);
          }
        });
    }
  }

  filterContact(event: AutoCompleteCompleteEvent) {
    const filtered: Contact[] = [];
    const query = event.query;

    for (const contact of this.modifiedContacts) {
      if (contact.fullName?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(contact);
      }
    }

    this.filteredContacts = filtered;
  }
}
