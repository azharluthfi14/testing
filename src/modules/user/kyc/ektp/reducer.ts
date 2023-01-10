import { CommonError } from '../../../types';
import { Ektp, EktpAction } from './actions';
import {
    EKTP_CREATE,
    EKTP_CREATE_FETCH,
    EKTP_DATA,
    EKTP_ERROR,
    EKTP_FETCH,
} from './constants';


export interface EktpState {
    ektp?: Ektp;
    dataLoaded?: boolean;
    error?: CommonError;
}

export const initialEktpState: EktpState = {
    ektp: undefined,
    dataLoaded: false,
};

export const ektpReducer = (state = initialEktpState, action: EktpAction): EktpState => {
    switch (action.type) {
        case EKTP_FETCH:
            return {
                ...state,
                error: undefined,
            };
        case EKTP_DATA:
            return {
                ...state,
                ektp: action.payload,
                dataLoaded: true,
            };
        case EKTP_CREATE_FETCH:
            return {
                ...state,
                error: undefined,
            };
        case EKTP_CREATE:
            return {
                ...state,
                ektp: state.ektp,
            };
        case EKTP_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
