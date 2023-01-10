import { CommonError } from '../../types';
import { USER_DELETE_DATA, USER_DELETE_ERROR, USER_DELETE_FETCH } from './constant';

interface UserDeleteFetchPayload {
    password: string;
    otp_code: string;
}

export interface UserDeleteSuccessPayload {
    message: string;
}

export interface UserDeleteFetch {
    type: typeof USER_DELETE_FETCH;
    payload: UserDeleteFetchPayload;
}

export interface UserDeleteData {
    type: typeof USER_DELETE_DATA;
    payload: UserDeleteSuccessPayload;
}

export interface UserDeleteError {
    type: typeof USER_DELETE_ERROR;
    error: CommonError;
}

export type UserDeleteAction =
    UserDeleteFetch
    | UserDeleteData
    | UserDeleteError;

export const getUserDelete = (payload: UserDeleteFetchPayload): UserDeleteFetch => ({
    type: USER_DELETE_FETCH,
    payload,
});

export const userDeleteData = (payload: UserDeleteData['payload']): UserDeleteData => ({
    type: USER_DELETE_DATA,
    payload,
});

export const userDeleteError = (error: CommonError): UserDeleteError => ({
    type: USER_DELETE_ERROR,
    error,
});
