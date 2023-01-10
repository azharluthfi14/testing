import * as React from 'react';
import { useDispatch } from 'react-redux';
import { getUserReferral } from '../modules';

export const useUserReferralFetch = ({ page = 0, limit = 25 }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUserReferral({ page, limit }));
    }, [dispatch, page, limit]);
};
