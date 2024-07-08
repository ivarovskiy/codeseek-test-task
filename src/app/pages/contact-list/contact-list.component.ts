import { Component, OnInit, inject } from '@angular/core';
import { Contact } from '@models/contact.interface';
import { ContactService } from '@services/contact.service';
import { BehaviorSubject } from 'rxjs';
import { SearchComponent } from './components/search/search.component';
import { ContactTreeComponent } from './components/contact-tree/contact-tree.component';
import { AsyncyPipe } from '@tony-builder/asyncy';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [ContactTreeComponent, SearchComponent, AsyncyPipe, ButtonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  private router = inject(Router);
  private contactService = inject(ContactService);

  contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  ngOnInit(): void {
    this.contactService.getAllContacts().subscribe({
      next: contacts => {
        this.contacts$.next(contacts);
      },
      error: error => console.error('Error fetching contacts:', error),
    });
  }

  selectedContact(contact: Contact) {
    this.router.navigate(['/contact-details', contact.id]);
  }

  createContact() {
    this.router.navigate(['/contact-new']);
  }
}
