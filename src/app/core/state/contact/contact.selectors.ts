import { createSelector } from '@ngrx/store';
import { FavoriteState } from './contact.reducer';
import { AppState } from '@state/app.state';

export const selectFavoriteContacts = (state: AppState) => state.favorites;

export const selectAllFavoriteContacts = createSelector(
  selectFavoriteContacts,
  (state: FavoriteState) => state.favoriteContacts
);
