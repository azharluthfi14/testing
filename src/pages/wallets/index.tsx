import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useDocumentTitle, useWalletsFetch } from '../../hooks';
import { selectWallets } from '../../modules';
import { EstimatedValue,WalletItem } from '../../components';
import { starOutline, star } from 'ionicons/icons';
import './wallet.css'
import { DEFAULT_CCY_PRECISION,VALUATION_PRIMARY_CURRENCY } from '../../constants';

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
import {
    selectMarketTickers,
} from '../../modules';

const Wallet: React.FC = () => {
    const wallets = useSelector(selectWallets) || [];
    const history = useHistory();
    const [searchKey, setSearchKey] = React.useState('');
    const [checked, setChecked] = React.useState(false);
    const tickers = useSelector(selectMarketTickers);
    useDocumentTitle('Wallets');     
    const getEstimation = (c,b) => {
        const pair = c.toLowerCase()+VALUATION_PRIMARY_CURRENCY.toLowerCase()
        const ticker = tickers[pair] || {last: 0}
        let price = Number(ticker.last) || 0
        if(VALUATION_PRIMARY_CURRENCY.toLowerCase() === c.toLowerCase())price=1
        return ((Number(b) || 0) * Number(price))
    }   

    const filteredWallet = wallets.filter(obj => obj.name.toLowerCase().includes(searchKey.toLowerCase()) || obj.currency.toLowerCase().includes(searchKey.toLowerCase()))   
    var filteredBalance = filteredWallet
    if(checked){
        filteredBalance = filteredWallet.filter(obj => getEstimation(obj.currency,obj.balance) > 1000 || getEstimation(obj.currency,obj.locked) > 1000)   
    }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="pt-2 bg-main">
                    <IonTitle>Wallets</IonTitle>
                    <div className='content'>
                        <EstimatedValue/>
                    </div>
                    <IonSearchbar animated={true} placeholder="Search Assets" onIonChange={(e)=>setSearchKey(e.target.value)}></IonSearchbar>
                </IonToolbar>
                <div className='content mt-1'>
                    <div className='separate'>
                        <div className='t2 pb-1'>List your assets</div>
                        <div className="custom-control custom-checkbox mb-1 t2 checkbox-small" onClick={() => setChecked(!checked)}>
                            <input type="checkbox" className="custom-control-input" checked={checked} onChange={() => setChecked(!checked)}/>
                            <label className="custom-control-label">
                                Hide Small Balance
                            </label>
                        </div>
                    </div>
                </div>
                <div className='wallet-section bg-body pb-1'>
                    <div className='separate wallet_header text-small'>
                        <div className='wallet_header_item'></div>
                        <div className='wallet_header_item'>Assets</div>
                        <div className='wallet_header_item'>Locked</div>
                        <div className='wallet_header_item'>Balance</div>
                    </div>
                </div>
            </IonHeader>
            <IonContent className='bg-body'>
                { wallets.length === 0 && (
                    <div className='text-center pt-3 pb-3'>
                        <IonSpinner name="bubbles"/>
                    </div>
                )}
                {filteredBalance.map((wallet, index) =>
                    <WalletItem
                        onClick={c => history.push(`/user/wallets/${c}`)}
                        wallet={wallet}
                        tickers={tickers}
                        key={index}
                />)}
            </IonContent>
        </IonPage>
    )
};

export default Wallet;
