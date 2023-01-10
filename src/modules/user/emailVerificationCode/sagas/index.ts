import { takeLatest } from 'redux-saga/effects';
import { CREATE_CONFIRMATION_CODE_FETCH } from '../constants';
import { createConfirmationCodeSaga } from './createConfirmationCodeSaga';

export function* rootConfirmationCodeSaga() {
    yield takeLatest(CREATE_CONFIRMATION_CODE_FETCH, createConfirmationCodeSaga);
}