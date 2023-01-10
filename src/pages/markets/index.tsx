import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Decimal} from '../../components';
import {getFavorite} from '../../helpers'
import './market.css';

import {
  Market,
  selectMarkets,
  selectMarketTickers,
  setCurrentMarket,
  selectUserInfo,
  selectUserLoggedIn,
  changeUserDataFetch,
} from '../../modules';

import { useMarketsFetch,useMarketsTickersFetch } from '../../hooks';
import { starOutline, star } from 'ionicons/icons';

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

const defaultTicker = {
  amount: '0.0',
  last: '0.0',
  high: '0.0',
  open: '0.0',
  low: '0.0',
  price_change_percent: '+0.00%',
  volume: '0.0',
};

const Markets = props => {
  useMarketsFetch();
  useMarketsTickersFetch();
  const history = useHistory();
  const dispatch = useDispatch();
  const markets = useSelector(selectMarkets);
  const marketTickers = useSelector(selectMarketTickers);
  const userData = useSelector(selectUserInfo);
  const [currentBidUnit, setCurrentBidUnit] = React.useState('');
  const [searchKey, setSearchKey] = React.useState('');
  const favorite = getFavorite(userData)
  const isLogin = useSelector(selectUserLoggedIn);
  const [filterKey, setFilterKey] = React.useState('trending');

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
    if(currentBidUnit === '') setCurrentBidUnit(currentBidUnitsList[1])
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

  let sortedMarket = filteredMarkets
  if(filterKey === 'trades') {
      sortedMarket = filteredMarkets.sort((a, b) => Number(b.volume) - Number(a.volume));
  }
  if(filterKey === 'trending') {
      sortedMarket = filteredMarkets.sort((a, b) => Number(b.price_change_percent.replace("%", "")) - Number(a.price_change_percent.replace("%", "")));
  }
  if(filterKey === 'value') {
      sortedMarket = filteredMarkets.sort((a, b) => Number(b.last) - Number(a.last));
  }


  const availableMarket = sortedMarket.filter(market => market.state !== 'hidden')
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

  const handleRefresh = (event) => {
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
    
  }

  const renderMarkets = () => {
      return (
        <IonPage className='bg-body'>
          <IonHeader>
            <IonToolbar className='bg-body'>
              <IonTitle>Markets</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonSearchbar animated={true} placeholder="Search Market" onIonChange={(e)=>setSearchKey(e.target.value)}></IonSearchbar>
          <div className='separate pl-5 pr-5 pb-2 pt-2'>
              <div className={`group-icon ${filterKey === "trending" ? "active" : ""}`} onClick={()=> setFilterKey('trending')}>
                  <div>
                      <img src="/assets/images/trending.png" alt="Trending" />
                  </div>
                  <div className='group-icon__title'>Trending</div>
              </div>
              <div className={`group-icon ${filterKey === "value" ? "active" : ""}`} onClick={()=> setFilterKey('value')}>
                  <div>
                      <img src="/assets/images/trades.png" alt="value" />
                  </div>
                  <div className='group-icon__title'>Best Value</div>
              </div>
              <div className={`group-icon ${filterKey === "trades" ? "active" : ""}`} onClick={()=> setFilterKey('trades')}>
                  <div>
                      <img src="/assets/images/value.png" alt="Trades" />
                  </div>
                  <div className='group-icon__title'>Top Trades</div>
              </div>
          </div>



          <div className='separate-start content pl-3 text-large'>
            {currentBidUnitsList.map((data)=> (
              <div onClick={()=>setCurrentBidUnit(data)} key={data} className={`market-nav ${data === currentBidUnit ? 'active' : ''}`}>
                {data}
              </div>
            ))}
          </div>
          <div className='separate content market_header'>
              <div className='market_header_item'></div>
              <div className='market_header_item'>Name</div>
              <div className='market_header_item'>Last Price</div>
              <div className='market_header_item'>24H Change</div>
          </div>         
          <IonContent className='bg-body'>
            <IonRefresher slot='fixed' onIonRefresh={handleRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            {!markets.length && (
              <div className='text-center pt-3 pb-3'>
                <IonSpinner name="bubbles"/>
              </div>
            )}
            {!availableMarket.length && markets.length > 0 && (
              <div className='text-center pt-3 pb-5'>
                No market available for this key
              </div>
            )}
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
        </IonPage>
      );
    };

    return renderMarkets();
};

export default Markets;
