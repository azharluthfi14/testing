import * as React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { selectCurrentMarket } from '../../modules';
import { Charts } from './Charts';
import { CreateOrder } from './CreateOrder';
import { useHistory } from 'react-router';
import { getFavorite } from '../../helpers';
import { 
    selectUserInfo,
    selectUserLoggedIn,
    changeUserDataFetch 
} from '../../modules';
import { 
    IonContent,
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonTitle, 
    IonHeader, 
    IonModal, 
    IonIcon, 
} from '@ionic/react';
import { starOutline, star,closeOutline } from 'ionicons/icons';

const TradingTabsComponent: React.FC = () => {
    const [currentOrderType, setCurrentOrderType] = React.useState(0);
    const [showCreateOrder, setShowCreateOrder] = React.useState(false);
    const [favoriteIcon, setFavoriteIcon] = React.useState(false);
    const currentMarket = useSelector(selectCurrentMarket);
    const dispatch = useDispatch();
    const isLogin = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    const history = useHistory();
    const [listFavorite, setListFavorite] = React.useState(undefined);
    const [favorited, setFavorited] = React.useState(false);
    
    const redirectToCreateOrder = (index: number) => {
        setCurrentOrderType(index);
        setShowCreateOrder(true)                
    };


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
                    ...(language && { language }),
                    favorite: JSON.parse(list),
                }),
            };
            dispatch(changeUserDataFetch({ user: payload }));           
        }
        setListFavorite(list)
    }

    const name = currentMarket?.name || ''
    const closeModal = () => {
        setShowCreateOrder(false)  
    }
    
    return (
        <React.Fragment>
            <div className='chart-area'>
                <Charts redirectToCreateOrder={redirectToCreateOrder} />
            </div>
            <IonModal isOpen={showCreateOrder} onDidDismiss={()=>closeModal()}>
                <IonHeader>
                    <IonToolbar className='bg-body content'>
                        <IonButtons slot="start" onClick={()=>addRemoveFavorites(currentMarket.id)}>
                            <IonIcon slot="icon-only" icon={favorited ? star : starOutline} className="mr-1"></IonIcon>
                        </IonButtons>
                        <IonTitle className='ion-text-center text-large'>
                            <IonButton fill="clear">
                                <div className='text-large text-dark bold'>{currentMarket ? currentMarket.name : ''}</div>
                            </IonButton>
                        </IonTitle>
                        <IonButtons slot="end" onClick={() => setShowCreateOrder(false)}>
                            <IonIcon slot="icon-only" icon={closeOutline} className="ml-1"></IonIcon>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                    <CreateOrder currentOrderTypeIndex={currentOrderType} />
            </IonModal>
        </React.Fragment>
    );
};

export const TradingTabs = React.memo(TradingTabsComponent);
