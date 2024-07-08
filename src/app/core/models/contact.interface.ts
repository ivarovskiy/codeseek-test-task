import { PhoneType } from './phone-type.enum';

export interface PhoneNumber {
  type: PhoneType;
  number: string;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumbers: PhoneNumber[];
  birthDate?: string;
  email?: string;
  address?: string;
  fullName?: string;
  isFavorite?: boolean;
}
