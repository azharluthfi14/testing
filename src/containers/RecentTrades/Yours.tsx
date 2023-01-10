import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Decimal } from '../../components';
import { LockIcon } from '../../assets/images/LockIcon';
import { useUserOrdersHistoryFetch } from '../../hooks';
import {
    ordersHistoryCancelFetch,
    selectOrdersHistory,
    selectShouldFetchCancelAll,
    selectShouldFetchCancelSingle,
    selectUserLoggedIn,
    selectCurrentMarket,
    userOrdersHistoryFetch,
} from '../../modules';
import { localeDate } from '../../helpers';
import { trashOutline } from 'ionicons/icons';
import { IonIcon,useIonActionSheet } from '@ionic/react';

const OrdersComponent: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const currentMarket = useSelector(selectCurrentMarket);
    const [present,dismiss] = useIonActionSheet();
    useUserOrdersHistoryFetch(0, 'open', 10,currentMarket.id);
    
    React.useEffect(() => {
        dispatch(userOrdersHistoryFetch({ pageIndex: 0, type: 'open', limit: 10,market: currentMarket.id }));
    }, [currentMarket]);


    const handleCancelSingleOrder = (id: number) => {
        if (shouldFetchCancelAll && shouldFetchCancelSingle && id) {
            dispatch(ordersHistoryCancelFetch({
                id,
                type: 'close',
                list: orders,
            }));
            setTimeout(() => {
                dispatch(userOrdersHistoryFetch({ pageIndex: 0, type: 'open', limit: 10,market: currentMarket.id }));
            }, 1000)
        }
    };

    const renderTab = () => (
        <div className="pg-mobile-orders__content pb-0">
            <div className='order-mobile-list pl-1 pr-1'>
                {orders.length ? (
                    <table className='order-row'>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td>{localeDate(order.created_at, 'shortDate')}</td>
                                    <td><Decimal fixed={currentMarket.price_precision} thousSep="." floatSep=','>{order.price ? order.price : order.avg_price}</Decimal></td>
                                    <td><Decimal fixed={currentMarket.amount_precision} thousSep="." floatSep=','>{order.origin_volume}</Decimal></td>
                                    <td><Decimal fixed={currentMarket.amount_precision} thousSep="." floatSep=','>{order.executed_volume}</Decimal></td>
                                    <td>
                                        <div onClick={()=>handleDelete(order.id)}>
                                            <IonIcon slot="end" icon={trashOutline} color='danger'></IonIcon>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='text-center mt-4'>
                        <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
                    </div>
                )}
            </div>
        </div>
    );

    const handleDelete = (id) => {
        present({
            header: 'Delete Order',
            subHeader: 'Are you sure want cancel this order?',
            cssClass: 'my-custom-class',
            buttons: [
              {
                text: 'Yes, Im Sure',
                role: 'destructive',
                handler: () => {
                    handleCancelSingleOrder(id);
                    dismiss();
                },
                data: {
                  action: 'delete',
                },
              },
              {
                text: 'Close',
                role: 'cancel',
                data: {
                  action: 'cancel',
                },
              },
            ]
          }) 
    }

    return (
        <>
            <div className='pl-1 pr-1'>
                <table className='order-table'>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Price</th>
                            <th>Volume</th>
                            <th>Filled</th>
                            <th>#</th>
                        </tr>
                    </thead>
                </table>
            </div>
            {!isLoggedIn && (
                <div className='text-center mt-4'>
                    <LockIcon className="lock_icon" />
                    <div>Please Login</div>
                </div>
            )}
            {isLoggedIn &&  renderTab() }
        </>
    );
};

export const RecentTradesYours = React.memo(OrdersComponent);