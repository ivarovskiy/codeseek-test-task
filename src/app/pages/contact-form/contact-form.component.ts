import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact, PhoneNumber } from '@models/contact.interface';
import { ContactService } from '@services/contact.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PhoneType } from '@models/phone-type.enum';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    CommonModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  contactId: number | null = null;
  isEditMode: boolean = false;
  phoneTypes = this.getPhoneTypes();

  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private subscription = new Subscription();

  ngOnInit(): void {
    this.initializeForm();

    const contactId = this.activatedRoute.snapshot.paramMap.get('id');
    if (contactId) {
      this.contactId = +contactId;
      this.isEditMode = true;
      this.loadContact(this.contactId);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeForm(): void {
    this.contactForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumbers: this.fb.array([]),
      birthDate: [''],
      email: ['', [Validators.email]],
      address: [''],
    });

    this.addPhoneNumber();
  }

  setPhoneNumbers(phoneNumbers: PhoneNumber[]): void {
    const phoneNumberFGs = phoneNumbers.map(phoneNumber =>
      this.fb.group(phoneNumber)
    );
    const phoneNumberFormArray = this.fb.array(phoneNumberFGs);
    this.contactForm.setControl('phoneNumbers', phoneNumberFormArray);
  }

  get phoneNumbers(): FormArray {
    return this.contactForm.get('phoneNumbers') as FormArray;
  }

  addPhoneNumber(): void {
    this.phoneNumbers.push(
      this.fb.group({
        type: [PhoneType.Mobile, Validators.required],
        number: ['', Validators.required],
      })
    );
  }

  removePhoneNumber(index: number): void {
    this.phoneNumbers.removeAt(index);
  }

  private getPhoneTypes(): { label: string; value: PhoneType }[] {
    return Object.keys(PhoneType).map(key => ({
      label: key,
      value: PhoneType[key as keyof typeof PhoneType],
    }));
  }

  loadContact(id: number): void {
    this.subscription.add(
      this.contactService.getContactById(id).subscribe({
        next: contact => {
          if (contact) {
            this.contactForm.patchValue(contact);
          }
        },
        error: error => console.error('Error fetching contact:', error),
      })
    );
  }

  saveContact(): void {
    if (this.contactForm.valid) {
      const contact: Contact = this.contactForm.value;
      if (this.isEditMode && this.contactId) {
        this.contactService.updateContact(this.contactId, contact);
      } else {
        this.contactService.createContact(contact);
      }
      this.router.navigate(['/contact-list']);
    }
  }

  cancel(): void {
    this.router.navigate(['/contact-list']);
  }
}
