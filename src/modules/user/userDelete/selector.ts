import { RootState } from '../../';

export const selectUserDelete = (state: RootState) =>
    state.user.userDelete.message;

export const selectUserDeleteSuccess = (state: RootState) =>
    state.user.userDelete.success;

export const selectUserDeleteLoading = (state: RootState): boolean =>
    state.user.userDelete.loading;
