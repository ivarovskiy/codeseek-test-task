import { Contact } from '@models/contact.interface';
import { createAction, props } from '@ngrx/store';

export const addFavorite = createAction(
  '[Contact Details Component] Add To Favorite',
  props<{
    contact: Contact;
  }>()
);

export const removeFavorite = createAction(
  '[Contact Details Component] Remove From Favorite',
  props<{ contactId: number }>()
);
