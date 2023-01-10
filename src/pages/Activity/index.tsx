import React, { useCallback, useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Pagination } from '../../components';
import { useUserActivityFetch } from '../../hooks';
import {
    RootState,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityNextPageExists,
    getUserActivity,
    selectUserActivityLoading,
} from '../../modules';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { UserActivityItem } from '../../components/Profile';
import './style.css'


const DEFAULT_LIMIT = 10;

const Activity: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const history = useHistory();
    const page = useSelector(selectUserActivityCurrentPage);
    const userActivity = useSelector(selectUserActivity);
    const isLoading = useSelector(selectUserActivityLoading);
    const firstElemIndex = useSelector((state: RootState) => selectUserActivityFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectUserActivityLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectUserActivityNextPageExists(state, DEFAULT_LIMIT));
    const dispatch = useDispatch();
    useUserActivityFetch({page: currentPage, limit: DEFAULT_LIMIT});

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    const handleRefresh = useCallback((event) => {
        setTimeout(() => {
            dispatch(getUserActivity({ page: currentPage, limit: DEFAULT_LIMIT }));
            event.detail.complete();
        }, 1000)
    }, []);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>Account Activity</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <IonRefresher slot='fixed' onIonRefresh={handleRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {isLoading && (
                    <div className='text-center pt-3 pb-3'>
                        <IonSpinner name="bubbles"/>
                    </div>
                )}
                {!isLoading && (
                    <div className='activity-content content font-12'>
                        {userActivity.length ? (
                            userActivity.map((item, index) => <UserActivityItem key={index} item={item} />)
                        ) : (
                            <div className="text-center empty-img">
                                <div>
                                    <img src="/assets/images/empty.png" alt="" />
                                </div>
                                <div className="mt-2 no-data">No Data found</div>
                            </div>
                        )}
                    </div>  
                )}

            </IonContent>
            <div className='bg-body'>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={currentPage}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={onClickPrevPage}
                    onClickNextPage={onClickNextPage}
                />
            </div>

        </IonPage>
    );
};

export default Activity;
