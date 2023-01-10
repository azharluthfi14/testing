import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { CommonError } from '../../types';
import { UserDeleteAction } from './action';
import { USER_DELETE_DATA, USER_DELETE_ERROR, USER_DELETE_FETCH } from './constant';

export interface UserDeleteState {
    error?: CommonError;
    success: boolean;
    message: string;
    loading: boolean;
}

export const initialUserDeleteState: UserDeleteState = {
    message: '',
    loading: false,
    success: false
};

export const userDeleteReducer = (state = initialUserDeleteState, action: UserDeleteAction) => {      
    switch (action.type) {
        case USER_DELETE_FETCH:
            return {
                ...state,
                loading: true,
            };
        case USER_DELETE_DATA:           
            return {
                ...state,
                message: action.payload.message,
                loading: false,
                success: true
            };
        case USER_DELETE_ERROR:
            return {
                ...state,
                error: action.error,
                message: '',
                loading: false
            };
        default:
            return state;
    }
};
