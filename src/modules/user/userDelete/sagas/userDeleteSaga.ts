import { call, put } from 'redux-saga/effects';
import { sendError,alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userDeleteError, UserDeleteFetch, userDeleteData } from '../action';
import { getCsrfToken } from '../../../../helpers';

const userDeleteOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'account',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};


export function* userDeleteSaga(action: UserDeleteFetch) {
    try {
        const { password,otp_code } = action.payload
        yield call(API.delete(userDeleteOptions(getCsrfToken())), `/resource/users/me?password=${password}&otp_code=${otp_code}`);
        yield put(alertPush({message: ['Account has been deleted'], type: 'success'}));
        localStorage.removeItem('csrfToken');
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userDeleteError,
            },
        }));
    }
}
