import classnames from 'classnames';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Decimal } from '../../components';
import { DEFAULT_CCY_PRECISION } from '../../constants';
import { getFavorite } from '../../helpers';
import { selectCurrentMarket, selectMarkets, selectMarketTickers,selectUserInfo,selectUserLoggedIn,changeUserDataFetch } from '../../modules';
import { useHistory } from 'react-router-dom';
import './style.css'

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};


const CurrentMarketInfoComponent: React.FC = () => {
    const currentMarket = useSelector(selectCurrentMarket);
    const markets = useSelector(selectMarkets);
    const isLogin = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    const tickers = useSelector(selectMarketTickers);
    const dispatch = useDispatch();
    const [isOpenMarketSelector, setOpenMarketSelector] = React.useState(false);
    const filteredMarkets = markets
    const marketsSearchKey = ''
    const history = useHistory();

    const currentMarketPricePrecision = currentMarket ? currentMarket.price_precision : DEFAULT_CCY_PRECISION;
    const currentMarketTicker = (currentMarket && tickers[currentMarket.id]) || defaultTicker;
    const currentMarketTickerChange = +(+currentMarketTicker.last - +currentMarketTicker.open).toFixed(currentMarketPricePrecision);
    const currentMarketChangeClass = classnames('', {
        'positive': (+currentMarketTickerChange || 0) >= 0,
        'negative': (+currentMarketTickerChange || 0) < 0,
    });
    
    React.useEffect(() => {
        setOpenMarketSelector(false);
    }, [currentMarket]);

    return (
        <React.Fragment>
            <div className='trading-area'>
                <div className='separate mt-1'>
                    <div style={{width:'50%'}}>
                        <div className={`text-large bold ${currentMarketChangeClass}`}>{Decimal.format(currentMarketTicker.last, currentMarketPricePrecision, ',')}</div>
                        <div className='separate text-small text-light'>
                            <div>Vol: {Decimal.format(currentMarketTicker.volume, currentMarketPricePrecision, ',')}</div>
                            <div className={currentMarketChangeClass}>{currentMarketTicker.price_change_percent}</div>
                        </div>
                    </div>
                    <div style={{width:'50%'}} className="ml-2">
                        <div className='separate'>
                            <div className='text-small text-light'>24H Low</div>
                            <div>{Decimal.format(currentMarketTicker.low, currentMarketPricePrecision, ',')}</div>
                        </div>
                        <div className='separate'>
                            <div className='text-small text-light'>24H High</div>
                            <div>{Decimal.format(currentMarketTicker.high, currentMarketPricePrecision, ',')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export const CurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
