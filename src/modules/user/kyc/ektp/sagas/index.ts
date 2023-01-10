import { takeEvery } from 'redux-saga/effects';
import { EKTP_CREATE_FETCH } from '../constants';
import { ektpCreateSaga } from './ektpCreateSaga';

export function* rootEktpSaga() {
    yield takeEvery(EKTP_CREATE_FETCH, ektpCreateSaga);
}
