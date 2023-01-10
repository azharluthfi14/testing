import * as React from 'react';
import { useDispatch } from 'react-redux';
import { userOrdersHistoryFetch } from '../modules';

export const useUserOrdersHistoryFetch = (pageIndex, type, limit,market) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(userOrdersHistoryFetch({ pageIndex, type, limit,market }));
    }, [dispatch, pageIndex, type, limit]);
};
