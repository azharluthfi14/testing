import * as React from 'react';
import { WalletWithdrawScreen } from '../../components/WalletWithdrawScreen';
import { useSelector } from 'react-redux';
import {
    selectUserInfo,
} from '../../modules';
import { 
    IonHeader, 
    IonPage, 
    IonIcon,
    IonMenu,
    IonButtons,
    IonToolbar,
    IonSegment,
    IonTitle,
    IonLabel,
    IonContent,
    IonSearchbar,
    IonMenuButton,
    IonMenuToggle,
} from '@ionic/react';
import { arrowBackOutline,swapHorizontalOutline } from 'ionicons/icons';
import {
    selectWallets,
    Wallet,
} from '../../modules/user/wallets';
import { menuController } from "@ionic/core";
import { useParams } from 'react-router';
import { DEFAULT_WALLET } from '../../constants';
import { Decimal } from '../../components/Decimal';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';

const WalletWithdraw: React.FC = () => {
    const user = useSelector(selectUserInfo);
    const intl = useIntl();

    const history = useHistory();
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];
    const wallet: Wallet = wallets.find(item => item.currency === currency) || DEFAULT_WALLET;  
    const [searchKey, setSearchKey] = React.useState('');
    const filteredWallet = wallets.filter(obj => obj.name.toLowerCase().includes(searchKey.toLowerCase()) || obj.currency.toLowerCase().includes(searchKey.toLowerCase()))   

    const handleClick = (w) => {
        menuController.close()
        history.push(`/user/wallets/${w.currency}/withdraw`)
        setTimeout(() => menuController.toggle(), 250);
    }

    return (
        <>
            <IonMenu contentId="main-content">
                <IonHeader>
                    <IonToolbar className='bg-body'>
                        <IonTitle>Select Currency</IonTitle>
                    </IonToolbar>
                    <div>
                        <IonSearchbar placeholder="search currency"  onIonChange={(e)=>setSearchKey(e.target.value)}></IonSearchbar>
                    </div>
                </IonHeader>
                <IonContent className="ion-padding bg-body">
                    <ul className="listview image-listview flush mb-2 bg-body">
                        {filteredWallet.map((w,index) => (
                            <li key={index} onClick={()=>handleClick(w)}>
                                <IonMenuToggle>
                                    <div className="item">
                                        <img src={w.iconUrl} className='image' alt={w.name} />
                                        <div className="in">
                                            <div>
                                                <div className='uppercase'>{w.currency}</div>
                                                <div>{w.name}</div>
                                            </div>
                                            <div>
                                                <Decimal fixed={w.fixed || 4} thousSep="." floatSep=','>
                                                    {w.balance || 0}
                                                </Decimal>
                                            </div>
                                        </div>
                                    </div>
                                </IonMenuToggle>
                            </li>
                        ))}
                    </ul>
                </IonContent>
            </IonMenu>

            <IonPage id="main-content bg-body">
                <IonHeader className='content bg-body'>
                    <IonToolbar className='bg-body'>
                        <IonButtons slot="start" onClick={()=>history.push(`/user/wallets/${currency}`)}>
                            <IonIcon slot="icon-only" icon={arrowBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle className='ion-text-center'>
                            Withdraw <span className='text-capitalize'>{wallet.name}</span>
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonMenuButton>
                                <IonIcon slot="icon-only" icon={swapHorizontalOutline}></IonIcon>
                            </IonMenuButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <WalletWithdrawScreen/>
            </IonPage>
        </>
    )
};

export default WalletWithdraw;
