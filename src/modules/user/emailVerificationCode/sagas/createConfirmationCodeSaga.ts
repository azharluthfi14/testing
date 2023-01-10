import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import {
    createConfirmationCodeData,
    createConfirmationCodeError,
    CreateConfirmationCodeFetch,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'account'
    };
};

export function* createConfirmationCodeSaga(action: CreateConfirmationCodeFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), '/identity/users/email/confirm_email_code', action.payload);
        yield put(createConfirmationCodeData());
        yield put(alertPush({message: ['success.confirm.code.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: createConfirmationCodeError,
            },
        }));
    }
}