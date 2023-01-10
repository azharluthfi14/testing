import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { CommonError } from '../../types';
import { UserReferralAction, UserReferralDataInterface } from './action';
import { USER_REFERRAL_DATA, USER_REFERRAL_ERROR, USER_REFERRAL_FETCH } from './constant';

export interface UserReferralState {
    loading: boolean;
    page: number;
    total: number;
    list: UserReferralDataInterface;
    error?: CommonError;
}

export const initialUserReferralState: UserReferralState = {
    list: {data: [],total: 0,month: 0,year: 0},
    loading: false,
    page: 0,
    total: 0,
};

export const userReferralReducer = (state = initialUserReferralState, action: UserReferralAction) => {      
    switch (action.type) {
        case USER_REFERRAL_FETCH:
            return {
                ...state,
                loading: true,
            };
        case USER_REFERRAL_DATA:           
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                loading: false,
                page: action.payload.page,
                total: action.payload.total,
            };
        case USER_REFERRAL_ERROR:
            return {
                ...state,
                error: action.error,
                list: [],
                loading: false,
                page: 0,
                total: 0,
            };
        default:
            return state;
    }
};
