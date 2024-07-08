import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Pipe({
  name: 'phoneCountry',
  standalone: true,
})
export class PhoneCountryPipe implements PipeTransform {
  transform(phoneNumber: string): string | undefined {
    const phoneNumberParsed = parsePhoneNumberFromString(phoneNumber);
    if (phoneNumberParsed) {
      return phoneNumberParsed.country;
    }
    return undefined;
  }
}
