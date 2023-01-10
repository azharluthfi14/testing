import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { EktpCreateFetch, ektpError,ektpData } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'account',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ektpCreateSaga(action: EktpCreateFetch) {
    try {
        const response = yield call(API.post(sessionsConfig(getCsrfToken())), '/identity/users/email/read_ektp', action.payload);
        yield put(ektpData(response));  
             
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: ektpError,
            },
        }));
    }
}
