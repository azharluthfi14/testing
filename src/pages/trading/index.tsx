import * as React from 'react';
import {
    useDepthFetch,
    useMarketsFetch,
    useMarketsTickersFetch,
} from '../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import { 
    IonPage, 
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonTitle, 
    IonHeader, 
    IonModal, 
    IonIcon, 
  } from '@ionic/react';
import { starOutline, star,arrowBackOutline,chevronDownOutline } from 'ionicons/icons';
import { selectCurrentMarket,selectUserLoggedIn,selectUserInfo,changeUserDataFetch,selectMarkets } from '../../modules'
import { getFavorite } from '../../helpers';
import './trading.css'

import { CurrentMarketInfo,TradingTabs } from '../../components';
import { MarketsTable } from '../../containers';
import { useHistory } from 'react-router-dom';

const Trading: React.FC = () => {
    useMarketsFetch();
    useMarketsTickersFetch();
    useDepthFetch();
    const history = useHistory();
    const markets = useSelector(selectMarkets);
    const currentMarket = useSelector(selectCurrentMarket);
    const [listFavorite, setListFavorite] = React.useState(undefined);
    const [favorited, setFavorited] = React.useState(false);
    const isLogin = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const [isOpenMarketSelector, setOpenMarketSelector] = React.useState(false);
    const marketsSearchKey = ''
    const filteredMarkets = markets

    if(!listFavorite && currentMarket) {
        setListFavorite(getFavorite(user))
    }

    React.useEffect(() => {
        if(listFavorite){                
            const favorite = JSON.parse(listFavorite)
            if(favorite.includes(currentMarket.id)){
                setFavorited(true)
            }else{
                setFavorited(false)
            }
        }
    }, [currentMarket,favorited,setFavorited,user]) 

    React.useEffect(() => {
        setOpenMarketSelector(false);
    }, [currentMarket]);  


    const addRemoveFavorites = (market) => {
        var fav         = JSON.parse(listFavorite)
        var list        = ''

        if(favorited){
            list = JSON.stringify(fav.filter((mkt)=>mkt !== market))
            setFavorited(false)
        }else{
            fav.push(market)
            list = JSON.stringify(fav)
            setFavorited(true)
        }

        if(!isLogin){
            localStorage.setItem('favoriteMarket', list);
        }
        if(isLogin){
            const data      = user.data && JSON.parse(user.data)           
            const language  = data && data.language ? data.language : null
            const payload = {
                ...user,
                data: JSON.stringify({
                    ...data,
                    language,
                    ...(language && { language }),
                    favorite: JSON.parse(list),
                }),
            };
            dispatch(changeUserDataFetch({ user: payload }));           
        }
        setListFavorite(list)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='bg-body'>
                    <IonButtons slot="start" onClick={()=>history.push('/user/markets')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center text-large' onClick={()=>setOpenMarketSelector(!isOpenMarketSelector)}>
                        <IonButton fill="clear">
                            <div className='text-large text-dark bold'>{currentMarket ? currentMarket.name : ''}</div>
                            <IonIcon slot="end" icon={chevronDownOutline}></IonIcon>
                        </IonButton>
                    </IonTitle>
                    <IonButtons slot="end" onClick={()=>addRemoveFavorites(currentMarket.id)}>
                        <IonIcon slot="icon-only" icon={favorited ? star : starOutline} className="mr-1"></IonIcon>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar className='bg-body'>
                    <CurrentMarketInfo />
                </IonToolbar>
                <TradingTabs /> 
            </IonHeader>

            <IonModal isOpen={isOpenMarketSelector} className='bg-body'>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Select Market</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={()=>setOpenMarketSelector(!isOpenMarketSelector)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <MarketsTable
                    handleChangeCurrentMarket={() => setOpenMarketSelector(false)}
                    markets={marketsSearchKey && filteredMarkets}
                />
            </IonModal>
        </IonPage>
    );
};

export default Trading;
