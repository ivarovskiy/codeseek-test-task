import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';
import { addFavorite, removeFavorite } from './contact.actions';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Contact } from '@models/contact.interface';

export interface FavoriteState {
  favoriteContacts: Contact[];
}

export const initialState: FavoriteState = {
  favoriteContacts: [],
};

export const favoriteReducer = createReducer(
  initialState,
  on(addFavorite, (state, { contact }) => ({
    ...state,
    favoriteContacts: [...state.favoriteContacts, contact],
  })),
  on(removeFavorite, (state, { contactId }) => ({
    ...state,
    favoriteContacts: state.favoriteContacts.filter(
      contact => contact.id !== contactId
    ),
  }))
);

function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: ['favorites'], rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];
