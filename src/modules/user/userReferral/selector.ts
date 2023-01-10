import { RootState } from '../../';

export const selectUserReferral = (state: RootState) =>
    state.user.userReferral.list;

export const selectTotalReferral = (state: RootState): number =>
    state.user.userReferral.total;

export const selectUserReferralCurrentPage = (state: RootState): number =>
    state.user.userReferral.page;


export const selectUserReferralPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.userReferral.total / limit);

export const selectUserReferralFirstElemIndex = (state: RootState, limit): number =>
    (state.user.userReferral.page * limit) + 1;

export const selectUserReferralLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.userReferral.page * limit) + limit > selectTotalReferral(state)) {
        return selectTotalReferral(state);
    } else {
        return (state.user.userReferral.page * limit) + limit;
    }
};

export const selectUserReferralNextPageExists = (state: RootState, limit: number): boolean =>
    (state.user.userReferral.page + 1) < selectUserReferralPageCount(state, limit);

export const selectUserReferralLoading = (state: RootState): boolean =>
    state.user.userReferral.loading;
