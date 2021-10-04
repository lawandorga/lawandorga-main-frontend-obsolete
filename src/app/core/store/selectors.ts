import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

export const selectAdminProfilesNotifications = (state: AppState): number => state.core.admin.profiles;
export const selectAdminRecordPermitNotifications = (state: AppState): number => state.core.admin.recordPermitRequests;
export const selectAdminRecordDeletionNotifications = (state: AppState): number => state.core.admin.recordDeletionRequests;

export const selectAdminNotifications = createSelector(
  selectAdminProfilesNotifications,
  selectAdminRecordPermitNotifications,
  selectAdminRecordDeletionNotifications,
  (profilesNotifications: number, recordPermitNotifications: number, recordDeletionNotifications: number) =>
    profilesNotifications + recordPermitNotifications + recordDeletionNotifications
);
