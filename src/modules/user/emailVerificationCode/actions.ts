import { CommonError } from '../../types';
import {
    CREATE_CONFIRMATION_CODE_DATA,
    CREATE_CONFIRMATION_CODE_ERROR,
    CREATE_CONFIRMATION_CODE_FETCH,
} from './constants';

export interface CreateCodePayload {
    email: string;
    code: string;
}

export interface CreateConfirmationCodeFetch {
    type: typeof CREATE_CONFIRMATION_CODE_FETCH;
    payload: CreateCodePayload;
}

export interface CreateConfirmationCodeData {
    type: typeof CREATE_CONFIRMATION_CODE_DATA;
}

export interface CreateConfirmationCodeError {
    type: typeof CREATE_CONFIRMATION_CODE_ERROR;
    error: CommonError;
}

export type CreateConfirmationCodeActions =
    CreateConfirmationCodeFetch
    | CreateConfirmationCodeData
    | CreateConfirmationCodeError;

export const createConfirmationCodeFetch = (payload: CreateConfirmationCodeFetch['payload']): CreateConfirmationCodeFetch => ({
    type: CREATE_CONFIRMATION_CODE_FETCH,
    payload,
});

export const createConfirmationCodeData = (): CreateConfirmationCodeData => ({
    type: CREATE_CONFIRMATION_CODE_DATA,
});

export const createConfirmationCodeError = (error: CommonError): CreateConfirmationCodeError => ({
    type: CREATE_CONFIRMATION_CODE_ERROR,
    error,
});