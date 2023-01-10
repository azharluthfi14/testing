import { CommonError } from '../../../modules/types';
import { CreateConfirmationCodeActions } from './actions';
import {
    CREATE_CONFIRMATION_CODE_DATA,
    CREATE_CONFIRMATION_CODE_ERROR,
    CREATE_CONFIRMATION_CODE_FETCH,
} from './constants';

export interface ConfirmationCodeState {
    fetching: boolean;
    success: boolean;
    error?: CommonError;
}

const initialState: ConfirmationCodeState = {
    fetching: false,
    success: false,
};

export const confirmationCodeReducer = (state = initialState, action: CreateConfirmationCodeActions) => {
    switch (action.type) {
        case CREATE_CONFIRMATION_CODE_FETCH:
            return { ...state, fetching: true };
        case CREATE_CONFIRMATION_CODE_DATA:
            return {
                ...state,
                success: true,
                fetching: false,
            };
        case CREATE_CONFIRMATION_CODE_ERROR: {
            return {
                ...state,
                error: action.error,
                fetching: false,
                success: false,
            };
        }
        default:
            return state;
    }
};