import { takeLatest } from 'redux-saga/effects';
import { USER_DELETE_FETCH } from '../constant';
import { userDeleteSaga } from './userDeleteSaga';

export function* rootUserDeleteSaga() {
    yield takeLatest(USER_DELETE_FETCH, userDeleteSaga);
}
