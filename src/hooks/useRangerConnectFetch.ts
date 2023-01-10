import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAbilities, selectLoadingAbilities, selectUserFetching, selectUserLoggedIn } from '../modules';
import { rangerConnectFetch } from '../modules/public/ranger';
import { selectRanger, selectShouldRangerConnect } from '../modules/public/ranger/selectors';

export const useRangerConnectFetch = () => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const userLoading = useSelector(selectUserFetching);
    const shouldFetch = useSelector(selectShouldRangerConnect);
    const abilities = useSelector(selectAbilities);
    const abilitiesLoading = useSelector(selectLoadingAbilities);
    const canReadP2P = false;
    const { connected, withAuth, withP2P } = useSelector(selectRanger);

    React.useEffect(() => {
        if(shouldFetch && !connected && !userLoading){
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn, withP2P: canReadP2P }));
        }
    }, [dispatch, shouldFetch, abilitiesLoading, connected, withAuth, userLoggedIn, abilities, canReadP2P, withP2P]);
};
