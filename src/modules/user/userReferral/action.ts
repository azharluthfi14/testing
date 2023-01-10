import { CommonError } from '../../types';
import { USER_REFERRAL_DATA, USER_REFERRAL_ERROR, USER_REFERRAL_FETCH } from './constant';

interface UserReferralFetchPayload {
    page: number;
    limit: number;
}

export interface UserReferralSuccessPayload {
    list: UserReferralDataInterface;
    page: number;
    total: number;
}

export interface UserReferralDataInterface {
    data: referralList[];
    total: number;
    month: number;
    year: number;
}
export interface referralList {
    email: number;
    level: number;
    state: string;
    username: string;
    created_at: string;
}

export interface UserReferralFetch {
    type: typeof USER_REFERRAL_FETCH;
    payload: UserReferralFetchPayload;
}

export interface UserReferralData {
    type: typeof USER_REFERRAL_DATA;
    payload: UserReferralSuccessPayload;
}

export interface UserReferralError {
    type: typeof USER_REFERRAL_ERROR;
    error: CommonError;
}

export type UserReferralAction =
    UserReferralFetch
    | UserReferralData
    | UserReferralError;

export const getUserReferral = (payload: UserReferralFetchPayload): UserReferralFetch => ({
    type: USER_REFERRAL_FETCH,
    payload,
});

export const userReferralData = (payload: UserReferralData['payload']): UserReferralData => ({
    type: USER_REFERRAL_DATA,
    payload,
});

export const userReferralError = (error: CommonError): UserReferralError => ({
    type: USER_REFERRAL_ERROR,
    error,
});
