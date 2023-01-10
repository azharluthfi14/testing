import { EktpState, RootState } from '../../../';

export const selectEktp = (state: RootState): EktpState['ektp'] => state.user.ektp.ektp;
export const selectEktpDataLoaded = (state: RootState): EktpState['dataLoaded'] => state.user.ektp.dataLoaded;
