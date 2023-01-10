import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ektpFetch } from '../modules';

export const useApiKeysFetch = (pageIndex, limit) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(ektpFetch());
    }, [dispatch]);
};

