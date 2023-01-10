import * as React from 'react';
import { useIntl } from 'react-intl';
import {TradingChart} from '../../../containers'
import { IonLabel, IonSegment, IonSegmentButton,IonContent } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { OrderButtons } from '../..';
import { OrderBook, RecentTrades } from '../../../containers';
import { RecentTradesYours } from '../../../containers/RecentTrades/Yours'
import {
    selectUserLoggedIn,
} from '../../../modules';
import { LockIcon } from '../../../assets/images/LockIcon';

const ChartsComponent = props => {
    const intl = useIntl();
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
    const label = ['Order Book','My Order','Market Trades']
    const key = ['book','order','trade']
    const isLoggedIn = useSelector(selectUserLoggedIn);
    return (
        <>
            <TradingChart />
            <div className='h-divider'></div>
            <IonSegment value={key[currentTabIndex]} className='bg-body'>
                <IonSegmentButton value="book" onClick={()=>setCurrentTabIndex(0)}>
                    <IonLabel>{label[0]}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="order" onClick={()=>setCurrentTabIndex(1)}>
                    <IonLabel>{label[1]}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="trade" onClick={()=>setCurrentTabIndex(2)}>
                    <IonLabel>{label[2]}</IonLabel>
                </IonSegmentButton>
            </IonSegment>
            <IonContent className="ion-no-padding trade-section bg-body">
                {currentTabIndex === 0 && <OrderBook forceLarge={true} />}   
                {currentTabIndex === 1 && (
                    <div>
                        {isLoggedIn ? <RecentTradesYours /> : (
                            <div className='text-center mt-4'>
                                <LockIcon className="lock_icon" />
                                <div>Please Login</div>
                            </div>
                        )}
                    </div>
                )}
                {currentTabIndex === 2 && <RecentTrades />}            
            </IonContent>
            <OrderButtons redirectToCreateOrder={props.redirectToCreateOrder} /> 
        </>
    );
};

export const Charts = React.memo(ChartsComponent);
