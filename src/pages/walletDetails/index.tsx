import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useDocumentTitle, useWalletsFetch,useMarketsTickersFetch } from '../../hooks';
import { selectWallets } from '../../modules/user/wallets';
import { useParams } from "react-router-dom";
import { DEFAULT_CCY_PRECISION } from '../../constants';
import { Decimal } from '../../components/Decimal';
import { HistoryTable } from '../../components/HistoryTable';
import './walletdetail.css'
import { 
    IonHeader, 
    IonPage, 
    IonIcon,
    IonSegmentButton,
    IonButtons,
    IonToolbar,
    IonSegment,
    IonTitle,
    IonLabel,
    IonFooter,
    IonButton,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

const WalletDetails: React.FC = () => {
    useWalletsFetch();
    useMarketsTickersFetch();

    const wallets = useSelector(selectWallets) || [];
    const history = useHistory();
    const params = useParams();
    const tabs = ['deposit', 'withdraw', 'transfer', 'trade']
    const [currentTab, setCurrentTab] = React.useState(0);


    useDocumentTitle('Wallets'); 
    const currency = params['currency']  || ''
    const wallet = wallets.find(w => w.currency === currency) || { fixed: DEFAULT_CCY_PRECISION, name: '',iconUrl: null, balance: 0,locked: 0 };
    const data = ['deposit','withdraw','transfer','trade']
    const getTotalBalance = (balance, locked) => {
        return parseFloat(balance) + parseFloat(locked)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='bg-main pt-1 pl-1'>
                    <IonButtons slot="start" onClick={()=>history.push('/user/wallets')} className="btn-back bg-body pl-0">
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet'>{wallet.name}</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
                <div className='content'>
                    <div className='mt-2'>
                        <div className='text-light'>Total Balance</div>
                        <div className='text-large uppercase bold'>
                            <Decimal fixed={wallet.fixed} thousSep="." floatSep=','>
                                {getTotalBalance(wallet.balance, wallet.locked)}
                            </Decimal>
                            &nbsp;&nbsp;{currency}
                        </div>
                    </div>
                    <div className='separate pb-2 pt-2'>
                        <div>
                            <div className='text-light'>Available Balance</div>
                            <div className='text-large uppercase bold'>
                                <Decimal fixed={wallet.fixed} thousSep="." floatSep=','>
                                    {wallet.balance || 0}
                                </Decimal>
                                &nbsp;&nbsp;{currency}
                            </div>
                        </div>
                        <div>
                            <div className='text-light'>Locked Balance</div>
                            <div className='text-large uppercase bold'>
                                <Decimal fixed={wallet.fixed} thousSep="." floatSep=','>
                                    {wallet.locked || 0}
                                </Decimal>
                                &nbsp;&nbsp;{currency}
                            </div>
                        </div>
                    </div>
                    <div className="separate mb-1">
                        <div className="text-medium">Transactions history</div>
                    </div>
                </div>
                <div className='segment pb-1 bg-body'>
                    <IonSegment color="primary" value={tabs[currentTab]} className="capitalize">
                        {tabs.map((data,index) => (
                            <IonSegmentButton value={data} key={index} onClick={()=>setCurrentTab(index)}>
                                <IonLabel>{data}</IonLabel>
                            </IonSegmentButton>
                        ))}
                    </IonSegment>
                </div>
            </IonHeader>
            {currentTab === 0 && (<HistoryTable currency={currency} type="deposits" />)}
            {currentTab === 1 && (<HistoryTable currency={currency} type="withdraws" />)}
            {currentTab === 2 && (<HistoryTable currency={currency} type="transfers" />)}
            {currentTab === 3 && (<HistoryTable currency={currency} type="trades" />)}
        </IonPage>
    )
};

export default WalletDetails;
