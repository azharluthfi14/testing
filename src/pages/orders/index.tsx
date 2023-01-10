import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Decimal,Pagination } from '../../components';
import { useUserOrdersHistoryFetch } from '../../hooks';
import { localeDate } from '../../helpers';
import {
    ordersCancelAllFetch,
    ordersHistoryCancelFetch,
    RootState,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    selectShouldFetchCancelAll,
    selectShouldFetchCancelSingle,
    userOrdersHistoryFetch,
    selectOrdersHistoryLoading,
    selectMarkets,
} from '../../modules';
import './orders.css'

import { 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonSpinner,
    IonContent,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
  } from '@ionic/react';


const userOrdersHistoryTabs = ['open', 'close'];

const Orders: React.FC = () => {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
    const [showDialog, setShowDialog] = React.useState(false);
    const [showDialogAll, setShowDialogAll] = React.useState(false);
    const [idOrder, setIdOrder] = React.useState(null);
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const dispatch = useDispatch();
    const orders = useSelector(selectOrdersHistory);
    const isLoading = useSelector(selectOrdersHistoryLoading);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const firstElemIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 10));
    const lastElemIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 10));
    const ordersNextPageExists = useSelector(selectOrdersNextPageExists);
    useUserOrdersHistoryFetch(currentPageIndex, 'close', 10,'');
    const markets = useSelector(selectMarkets);

    React.useEffect(() => {
        dispatch(userOrdersHistoryFetch({ pageIndex: currentPageIndex, type: currentTabIndex === 0 ? 'open' : 'close', limit: 10,market: '' }));
    }, [currentTabIndex]);

    const currentMarket = (id) => {
        return (markets.length && markets.find(m => m.id === id)) || { name: '', price_precision: 0, amount_precision: 0 };
    }
    const actualPrice = (order) => {
        return order.ord_type === 'market' || order.state === 'done' ? order.avg_price : order.price;
    }
    
    
    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
        }
        setShowDialogAll(false)
        setTimeout(() => {
            dispatch(userOrdersHistoryFetch({ pageIndex: currentPageIndex, type: 'open', limit: 10,market: '' }));
        }, 1000)
    };

    const handleCancelSingleOrder = (id: number) => () => {
        if (shouldFetchCancelAll && shouldFetchCancelSingle) {
            dispatch(ordersHistoryCancelFetch({
                id,
                type: userOrdersHistoryTabs[currentTabIndex],
                list: orders,
            }));
        }
        setShowDialog(false)
        setTimeout(() => {
            dispatch(userOrdersHistoryFetch({ pageIndex: currentPageIndex, type: 'open', limit: 10,market: '' }));
        }, 1000)
    };

    const confirmCancelSingle = useCallback((id) => {
        setShowDialog(true)
        setIdOrder(id)              
    }, []);

    const handleConfirmCancelAllOrders = useCallback(() => {
        setShowDialogAll(true)
    }, []);


    const onClickPrevPage = () => {
        setPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setPageIndex(currentPageIndex + 1);
    };

    const changeIndex = (i) => {
        setCurrentTabIndex(i)
    }
    const handleRefresh = useCallback((event) => {
        setTimeout(() => {
            dispatch(userOrdersHistoryFetch({ pageIndex: currentPageIndex, type: currentTabIndex === 0 ? 'open' : 'close', limit: 10,market: '' }));
            event.detail.complete();
        }, 1000)
    }, []);


    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='bg-main'>
                    <IonTitle>Orders History</IonTitle>
                </IonToolbar>
                <div className='separate content mb-2'>
                    <IonSegment color="primary" value={currentTabIndex === 0 ? 'open' : 'close'} className="order-tabs">
                        <IonSegmentButton value="open" className='order-tabs-item' onClick={()=>changeIndex(0)}>
                            <IonLabel>Open</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="close" className="order-tabs-item" onClick={()=>changeIndex(1)}>
                            <IonLabel>Close</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    {currentTabIndex === 0 && orders.length > 0 && (
                        <IonButton size="small" color="danger" className='btn-cancel' onClick={()=>handleConfirmCancelAllOrders()}>
                            Cancel All
                        </IonButton>
                    )}
                </div>
                <div className='top-radius'></div>
                <IonContent className='mt-2 section-order bg-body'>
                    <IonRefresher slot='fixed' onIonRefresh={handleRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    <div className='content pt-2'>
                        {isLoading && (
                            <div className='text-center pt-3'>
                                <IonSpinner name="bubbles"/>
                            </div>
                        )}
                        {orders.length === 0 && !isLoading && (
                            <div className='text-center pt-3 pb-3'>
                                <img src="/assets/images/no-data.png" className="no-data" alt="" />
                                <div className='bold'>No History Found</div>
                            </div>
                        )}
                        {!isLoading && orders.map((order, index) => (
                            <div key={index} className="separate orders-row border-bottom">
                                <div className='orders-row-item'>
                                    <div className='bold uppercase'>{order.market}</div>
                                    <div className='text-extra-small uppercase'>{order.state}</div>
                                    <div className='text-extra-small'>Filled: {((Number(order.executed_volume) / Number(order.origin_volume)) * 100).toFixed(2)}%</div>
                                </div>
                                <div className='orders-row-item'>
                                    <div className={`uppercase bold ${order.side === 'buy' ? 'positive' : 'negative'}`}>{order.side} {order.ord_type}</div>
                                    <div className='t5 separate'>
                                        <div>Amount:</div>
                                        <div>
                                            <Decimal fixed={currentMarket(order.market).amount_precision}  floatSep="," thousSep=".">{order.origin_volume}</Decimal>
                                        </div>
                                    </div>
                                    <div className='t5 separate'>
                                        <div>Price:</div>
                                        <div>
                                            <Decimal fixed={currentMarket(order.market).price_precision} floatSep="," thousSep=".">{actualPrice(order)}</Decimal>
                                        </div>
                                    </div>
                                </div>
                                <div className='orders-row-item'>
                                    <div className='text-right'>                
                                        {order.state === 'wait' ? (
                                            <div className="text-danger" onClick={()=>confirmCancelSingle(order.id)}>
                                                <span>Cancel</span>
                                            </div>
                                        ) : ''}
                                    </div>
                                    <div className='text-right text-small'>{localeDate(order.created_at,'date')}</div>
                                    <div className='text-right text-small'>{localeDate(order.created_at,'time')}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </IonContent>
                <div className='bg-body'>
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        page={currentPageIndex}
                        nextPageExists={ordersNextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />
                </div>
            </IonHeader>
            {showDialog && (
                <div
                    className="modal fade dialogbox show"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content pt-0">
                            <div className="modal-header">
                                <h5 className="modal-title">Cancel Order</h5>
                            </div>
                            <div className="modal-body mb-0">
                                <div className='pt-2 pb-2'>Are you sure want to cancel order</div>                        
                            </div>
                            <div className="modal-footer">
                                <div className="btn-inline">
                                    <div className="btn btn-text-secondary" onClick={()=>setShowDialog(false)}>CLOSE</div>
                                    <div className="btn btn-text-danger" onClick={handleCancelSingleOrder(idOrder)}>SURE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDialogAll && (
                <div
                    className="modal fade dialogbox show"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content pt-0">
                            <div className="modal-header">
                                <h5 className="modal-title">Cancel Order</h5>
                            </div>
                            <div className="modal-body mb-0">
                                <div className='pt-2 pb-2'>Are you sure want to cancel all order</div>                        
                            </div>
                            <div className="modal-footer">
                                <div className="btn-inline">
                                    <div className="btn btn-text-secondary" onClick={()=>setShowDialogAll(false)}>CLOSE</div>
                                    <div className="btn btn-text-danger" onClick={handleCancelAllOrders}>SURE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </IonPage>
    );
};

export default Orders;