import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Decimal, CustomInputIcon } from '../../components';
import { getFavorite } from '../../helpers';

import {
    useMarketsFetch,
    useMarketsTickersFetch,
} from '../../hooks';
import {
    Market,
    selectMarkets,
    selectMarketTickers,
    setCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    changeUserDataFetch,
} from '../../modules';
import { 
    IonContent,
    IonSpinner,
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
} from '@ionic/react';
import { starOutline, star } from 'ionicons/icons';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const MarketsTableComponent = props => {
    useMarketsFetch();
    useMarketsTickersFetch();
    const history = useHistory();
    const dispatch = useDispatch();
    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);
    const userData = useSelector(selectUserInfo);
    const [currentBidUnit, setCurrentBidUnit] = React.useState('Favorite');
    const [searchKey, setSearchKey] = React.useState('');
    const favorite = getFavorite(userData)
    const isLogin = useSelector(selectUserLoggedIn);

    const handleRedirectToTrading = (id: string) => {
        const currentMarket: Market | undefined = markets.find(item => item.id === id);

        if (currentMarket) {
            props.handleChangeCurrentMarket && props.handleChangeCurrentMarket(currentMarket);
            dispatch(setCurrentMarket(currentMarket));
            history.push(`/user/trading/${currentMarket.id}`);
        }
    };

    const formatFilteredMarkets = (list: string[], market: Market) => {
        if (market.state && market.state === 'hidden' && userData.role !== 'admin' && userData.role !== 'superadmin') {
            return list;
        }

        if (!list.includes(market.quote_unit)) {
            list.push(market.quote_unit);
        }

        return list;
    };

    let currentBidUnitsList: string[] = ['Favorite'];

    if (markets.length > 0) {
        currentBidUnitsList = markets.reduce(formatFilteredMarkets, currentBidUnitsList);
    }

    let currentBidUnitMarkets = props.markets || markets;

    if (currentBidUnit && currentBidUnit != 'Favorite') {
        currentBidUnitMarkets = currentBidUnitMarkets.length ? currentBidUnitMarkets.filter(market => market.quote_unit === currentBidUnit) : [];
    }

    if(currentBidUnit === 'Favorite'){
        currentBidUnitMarkets = currentBidUnitMarkets.filter(item => favorite.includes(item.id));
    }

    const formattedMarkets = currentBidUnitMarkets.length ? currentBidUnitMarkets.map(market =>
        ({
            ...market,
            last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
            open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
            price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
            high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.amount_precision),
            low: Decimal.format(Number((marketTickers[market.id] || defaultTicker).low), market.amount_precision),
            volume: Decimal.format(Number((marketTickers[market.id] || defaultTicker).volume), market.amount_precision),
        }),
    ).map(market =>
        ({
            ...market,
            change: Decimal.format((+market.last - +market.open)
                .toFixed(market.price_precision), market.price_precision),
        }),
    ) : [];

    const marketChangeColor = (change) => {
        if(change === '0.0' || change === '+0.00') {
            return ''
        }
        return change.includes('+') ? 'positive' : 'negative'
    }
    const filteredMarkets = formattedMarkets.filter(obj => obj.name.toLowerCase().includes(searchKey.toLowerCase()) || obj.id.toLowerCase().includes(searchKey.toLowerCase()))
    const nFormatter = (num, digits) => {
        const lookup = [
          { value: 1, symbol: "" },
          { value: 1e3, symbol: "k" },
          { value: 1e6, symbol: "M" },
          { value: 1e9, symbol: "B" },
          { value: 1e12, symbol: "T" },
          { value: 1e15, symbol: "P" },
          { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
          return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

    const availableMarket = filteredMarkets.filter(market => market.state !== 'hidden')

    const addRemoveFavorites = (market) => {
        var fav             = JSON.parse(favorite)
        let listFavorite    = []

        if(fav.includes(market)){
            listFavorite = fav.filter((item) => item !== market)
        }
        if(!fav.includes(market)){
            listFavorite = fav
            listFavorite.push(market)
        }

        if(!isLogin){
            localStorage.setItem('favoriteMarket', JSON.stringify(listFavorite));
        }

        if(isLogin){
            const data      = userData.data && JSON.parse(userData.data)
            const language  = data && data.language ? data.language : null
            const payload = {
                ...userData,
                data: JSON.stringify({
                    ...data,
                    ...(language && { language }),
                    favorite: listFavorite,
                }),
            };
            dispatch(changeUserDataFetch({ user: payload })); 
        }
    }

    return (
        <>
            <IonSearchbar animated={true} placeholder="Search Market" onIonChange={(e)=>setSearchKey(e.target.value)}></IonSearchbar>
            <div className='separate-start content'>
                {currentBidUnitsList.map((data)=> (
                <div onClick={()=>setCurrentBidUnit(data)} key={data} className={`market-nav ${data === currentBidUnit ? 'active' : ''}`}>
                    {data}
                </div>
                ))}
            </div>
            {!markets.length && (
              <div className='text-center pt-3 pb-3'>
                <IonSpinner name="bubbles"/>
              </div>
            )}
            {!availableMarket.length && markets.length > 0 && (
              <div className='text-center pt-3 pb-5'>
                You don't have any favorite market
              </div>
            )}
            <IonContent className="ion-no-padding bg-body">
                <div className='content market-content'>
                {availableMarket.map((market) => (
                    <div className='separate mb-2 row_ticker' key={market.id}>
                    <div  onClick={()=>addRemoveFavorites(market.id)} className="icon-star row_ticker_item">
                        {favorite.includes(market.id) && (<IonIcon icon={star} size="medium"/>)}
                        {!favorite.includes(market.id) && (<IonIcon icon={starOutline} />)}
                    </div>
                    <div className='uppercase row_ticker_item'  onClick={() => handleRedirectToTrading(market.id)}>
                        <div><span className='text-medium bold'>{market.base_unit}</span><span className='text-medium text-light bold'> / {market.quote_unit}</span></div>
                        <div className='text-extra-small'>Vol: {nFormatter(market.volume,2)} {market.quote_unit}</div>
                    </div>
                    <div className='row_ticker_item' onClick={() => handleRedirectToTrading(market.id)}>
                        <div className={`${marketChangeColor(market.price_change_percent)} text-medium`}><Decimal fixed={market.price_precision} thousSep=",">{market.last}</Decimal></div>
                        <div className='text-extra-small'><Decimal fixed={market.price_precision} thousSep=",">{market.change}</Decimal> {market.quote_unit.toUpperCase()}</div>
                    </div>
                    <div className='row_ticker_item' onClick={() => handleRedirectToTrading(market.id)}>
                        <div
                            className={`btn_ticker text-medium ${marketChangeColor(market.price_change_percent)}`}
                        >
                            {market.price_change_percent}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </IonContent>
        </>
    );
};

export const MarketsTable = React.memo(MarketsTableComponent);
