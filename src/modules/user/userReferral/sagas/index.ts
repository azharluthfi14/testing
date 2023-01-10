import { takeLatest } from 'redux-saga/effects';
import { USER_REFERRAL_FETCH } from '../constant';
import { userReferralSaga } from './userReferralSaga';

export function* rootUserReferralSaga() {
    yield takeLatest(USER_REFERRAL_FETCH, userReferralSaga);
}
