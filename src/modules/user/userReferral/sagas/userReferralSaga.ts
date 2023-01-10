import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userReferralData, userReferralError, UserReferralFetch } from '../action';

const userReferralOptions: RequestOptions = {
    apiVersion: 'account',
    withHeaders: true,
};

export function* userReferralSaga(action: UserReferralFetch) {
    try {
        const { page, limit } = action.payload;
        const { data, headers } = yield call(API.get(userReferralOptions), `/resource/users/referral?limit=${limit}&page=${page + 1}`);
        yield put(userReferralData({ list: data, page, total: headers.total }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'console',
            extraOptions: {
                actionError: userReferralError,
            },
        }));
    }
}
