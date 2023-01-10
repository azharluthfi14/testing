import { RootState } from '../../';

export const selectConfirmationCodeCreateSuccess = (state: RootState): boolean =>
    state.user.confirmationCode.success;