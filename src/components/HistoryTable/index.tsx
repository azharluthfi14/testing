import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSelector,useDispatch } from 'react-redux';
import { Pagination, Decimal } from '../../components';
import { localeDate } from '../../helpers';
import { useHistory } from 'react-router';

import { 
    RootState, 
    selectCurrentPage, 
    selectLastElemIndex, 
    selectNextPageExists,
    selectUserInfo, 
    walletsFetch, 
    fetchHistory, 
    selectHistoryLoading, 
} from '../../modules';
import { selectCurrencies } from '../../modules/public/currencies';
import { selectFirstElemIndex, selectHistory } from '../../modules/user/history';
import {truncateMiddle} from '../../helpers';
import { 
    IonContent,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonFooter,
} from '@ionic/react';
import './style.css'
const DEFAULT_LIMIT = 6;

const HistoryTable = (props: any) => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const intl = useIntl();
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const currencies = useSelector(selectCurrencies);
    const isLoading = useSelector(selectHistoryLoading);
    const firstElemIndex = useSelector((state: RootState) => selectFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, DEFAULT_LIMIT));
    const user = useSelector(selectUserInfo);
    const uid = user.uid
    const dispatch = useDispatch();
    const history = useHistory();

    React.useEffect(() => {
        dispatch(walletsFetch());
        if(user.level < 2 && (props.type === 'withdraws' || props.type === 'trades')){
        }else{
            dispatch(fetchHistory({ type:props.type , limit: DEFAULT_LIMIT, currency:props.currency, page:currentPage }));
        }
    }, [props.type]);

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };
    const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
        const statusMapping = {
            succeed: <span className="history-success">{intl.formatMessage({ id: 'page.body.history.withdraw.content.status.succeed' })}</span>,
            completed: <span className="history-success">{intl.formatMessage({ id: 'page.body.history.withdraw.content.status.succeed' })}</span>,
            failed:  <span className="history-failed">{intl.formatMessage({ id: 'page.body.history.withdraw.content.status.failed' })}</span>,
            accepted: <span className="history-success">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.accepted' })}</span>,
            collected: <span className="history-success">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.collected' })}</span>,
            canceled: <span className="history-failed">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.canceled' })}</span>,
            rejected: <span className="history-failed">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.rejected' })}</span>,
            processing: <span className="history-pending">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.processing' })}</span>,
            prepared: <span className="history-pending">{intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span>,
            submitted: <span className="history-pending">{(confirmations !== undefined && minConfirmations !== undefined) ? (
                `${confirmations}/${minConfirmations}`
            ) : (
                intl.formatMessage({ id: 'page.body.wallets.table.pending' })
                )}</span>,
            skipped: <span className="history-success">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.skipped' })}</span>,
        };

        return statusMapping[tx];
    };
    const getConfirmation = (type,item) => {
        return type === 'deposits' && item.confirmations;
    }

    const itemCurrency = currencies && currencies.find(cur => cur.id === props.currency);
    const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === props.currency);

    const getMinConfirmations = () => {
        return blockchainCurrency?.min_confirmations;
    }

    const formatTXID = (item) => {
        if(props.currency === 'idr'){
            return 'Bank Transfer'
        }
        const tid = item.txid ? item.txid : item.blockchain_txid || null
        if(!tid || tid === '') {
            return '-'
        }
        const detailCurrency = itemCurrency?.networks?.find(obj=>obj.protocol === item.protocol) || {explorer_transaction: null}
        const explorer = detailCurrency.explorer_transaction
        if(!explorer){
            return truncateMiddle(tid ? tid : '', 30)
        }
        const formatedExplorer = explorer.replace('#{txid}',tid)
        return <a href={formatedExplorer} target="_blank">{truncateMiddle(tid ? tid : '', 30)}</a>
    }

    const getFormatTXID = (type,item) => {
        const txMapping = {
            send: <span><span className="history-pending">Send &nbsp;</span>to {item.receiver_username ? item.receiver_username : item.receiver_uid}</span>,
            receive: <span><span className="history-success">Receive &nbsp;</span> from {item.sender_username ? item.sender_username : item.sender_uid}</span>,
        };

        const tradeMapping = {
            sell: <span className="history-success uppercase"><span className="history-pending">SELL &nbsp;</span>{props.currency} @ {Decimal.format(item.price, 0, ',')}</span>,
            buy: <span className="history-success uppercase"><span className="history-success">BUY &nbsp;</span> {props.currency} @ {Decimal.format(item.price, 0, ',')}</span>,
        };

        const tradeMappingFiat = {
            sell: <span className="history-success uppercase"><span className="history-pending">SELL &nbsp;</span>{item.market &&  item.market.replace("idr",'')} @ {Decimal.format(item.price, 0, ',')}</span>,
            buy: <span className="history-success uppercase"><span className="history-success">BUY &nbsp;</span> {item.market && item.market.replace("idr",'')} @ {Decimal.format(item.price, 0, ',')}</span>,
        };


        switch (type) {
            case 'deposits':
                return formatTXID(item)
            case 'withdraws':
                return formatTXID(item)
            case 'transfers':
                var tipe = 'send'
                if(uid === item.receiver_uid) tipe = 'receive'
                return txMapping[tipe]
            case 'trades':
                var t = item.taker_type || 'sell'
                return props.currency === 'idr' ? tradeMappingFiat[t] : tradeMapping[t]
            default:
                return '';
        }
    }
    const getFormatState = (type,item) => {
        switch (type) {
            case 'deposits':
                return formatTxState(item.state, getConfirmation(props.type,item), getMinConfirmations()) || '-'
                break;
            case 'withdraws':
                return formatTxState(item.state, getConfirmation(props.type,item), getMinConfirmations()) || '-'
                break;
            case 'transfers':
                return formatTxState(item.status, getConfirmation(props.type,item), getMinConfirmations()) || '-'
                break;
            default:
                return '';
        }
    }

    const handleRefresh = useCallback((event) => {
        setTimeout(() => {
            dispatch(fetchHistory({ type:props.type , limit: DEFAULT_LIMIT, currency:props.currency, page:currentPage }));
            event.detail.complete();
        }, 1000)
                   
    }, []);

    const goToDeposit = () => {
        history.push(`/user/wallets/${props.currency}/deposit`)
    }

    const goToWithdraw = () => {
        history.push(`/user/wallets/${props.currency}/withdraw`)    
    }


    return (
        <React.Fragment>
            <IonContent className='wallet-history-section bg-body'>
                <IonRefresher slot='fixed' onIonRefresh={handleRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {isLoading && (
                    <div className='text-center pt-3 pb-3'>
                        <IonSpinner name="bubbles"/>
                    </div>
                )}
                {!isLoading && (
                    <div className='content history-row'>
                        {list.length === 0 ? (
                            <div className="text-center mt-4">
                                <div>
                                    <img src="/assets/images/no-data.png" alt="" className='no-data'/>
                                </div>
                                <div className="no-data">No History found</div>
                            </div>
                        ) :
                            list.map( (item,index) => (
                                <div className='separate history-item' key={index}>
                                    <div>
                                        <div>{localeDate(item.created_at, 'fullDate')}</div>
                                        <div>{getFormatTXID(props.type, item)}</div>
                                    </div>
                                    <div>
                                        <div className='uppercase text-right bold'>
                                            <Decimal fixed={itemCurrency.precision} thousSep=",">{props.currency === 'idr' && props.type=== 'trades' ? Number(item.amount) * Number(item.price) : item.amount}</Decimal>
                                            &nbsp; {item.currency ? item.currency : props.currency}
                                        </div>
                                        <div className='text-right'>{getFormatState(props.type,item)}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </IonContent>
            <IonFooter>
                <div className='bg-body'>
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        page={page}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />
                    <div className="separate p-2 pt-0">
                        <IonButton
                            expand="block"
                            type="button"
                            onClick={()=> goToDeposit()}
                            className="btn-koinku w-50"
                            color="success"
                        >
                            Deposit {props.currency.toUpperCase()}
                        </IonButton>
                        <IonButton
                            expand="block"
                            type="button"
                            onClick={()=> goToWithdraw()}
                            className="btn-koinku w-50"
                            color="danger"
                        >
                            Withdraw {props.currency.toUpperCase()}
                        </IonButton>
                    </div>
                </div>
            </IonFooter>
        </React.Fragment>
    );
};

export {
    HistoryTable,
};
