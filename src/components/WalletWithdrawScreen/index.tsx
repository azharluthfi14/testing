import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useWalletsFetch } from '../../hooks';
import {
    selectWallets,
    Wallet,
} from '../../modules/user/wallets';
import { WalletWithdrawBody } from '../';
import { DEFAULT_WALLET } from '../../constants';
import { useIntl } from 'react-intl';
import {
    selectUserInfo,
} from '../../modules';
import { 
    IonButton,
    IonContent,
} from '@ionic/react';

const WalletWithdrawScreen: React.FC = () => {
    const history = useHistory();
    const intl = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];
    const user = useSelector(selectUserInfo);
    useWalletsFetch();
    const wallet: Wallet = wallets.find(item => item.currency === currency) || DEFAULT_WALLET;  
    const level = user.level || 0


    if (level < 3) {
        return (
            <>
            <IonContent className="ion-padding bg-body">                    
                <div className='text-center pt-4'>
                    <img src="/assets/images/padlock.png" alt="" style={{width: '80px'}}/>
                </div>
                <div className='text-center'>
                    {intl.formatMessage({ id: 'account.withdraw.not_permitted' })}
                </div>
                <div className="form-button-group">
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={() => history.push('/user/profile/verification')}
                        className="btn-koinku"
                        color="primary"
                    >
                        Go To Verification
                    </IonButton>
                </div>
             </IonContent>
            </>
        )
    }

    return (
        <React.Fragment>
            <WalletWithdrawBody wallet={wallet} wallets={wallets}/>
        </React.Fragment>
    );
};

export {
    WalletWithdrawScreen,
};
