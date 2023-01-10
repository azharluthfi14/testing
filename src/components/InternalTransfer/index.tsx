import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Decimal } from '../';
import { isUsernameEnabled } from '../../api';
import {
    createInternalTransfersFetch,
    selectInternalTransfersCreateSuccess,
    selectUserInfo,
    selectWallets,
    walletsFetch,
} from '../../modules';
import { InternalTransferInput } from './InternalInput';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner,IonButton,
    IonList, 
    IonItem, 
    IonSelect, 
    IonSelectOption  

} from '@ionic/react';
import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';

const InternalTransfer: React.FC = () => {    
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const wallets = useSelector(selectWallets);
    const user = useSelector(selectUserInfo);
    const transferSuccess = useSelector(selectInternalTransfersCreateSuccess);

    const [username, setUsername] = useState('');
    const [currency, setCurrency] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [amount, setAmount] = useState('');
    const [otp, setOtp] = useState('');
    const [clear, setClear] = useState(false);

    const [show, setShow] = useState(false);

    React.useEffect(() => {
        dispatch(walletsFetch());
    }, []);

    React.useEffect(() => {
        if (transferSuccess) {
            handleResetState();
        }
    }, [transferSuccess]);

    const walletsList = wallets.length ? wallets.map(item => item.currency && item.currency.toUpperCase()) : [];

    const wallet = wallets.length && wallets.find(item => item.currency.toLowerCase() === currency.toLowerCase());

    const balanceError = useMemo(() => classnames('cr-internal-transfer__group--balance', {
        'cr-internal-transfer__group--error': wallet && wallet.balance && +wallet.balance < +amount,
    }), [amount, wallet]);

    const translationUsername = isUsernameEnabled() ? 'username' : 'uid';

    const handleCreateTransfer = useCallback(() => {
        const payload = {
            currency: currency.toLowerCase(),
            username_or_uid: username,
            amount,
            otp
        };

        dispatch(createInternalTransfersFetch(payload));
        setShowDialog(false)
        setClear(false);
    }, [username, otp, amount, currency, dispatch]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const handleNavigateTo2fa = useCallback((enable2fa: boolean) => {
        history.push('/user/profile/2fa', { enable2fa });
    }, []);

    const handleResetState = () => {
        setShow(false);
        setUsername('');
        setCurrency('');
        setAmount('');
        setOtp('');
        setClear(true);
    }

    const renderFooter = useMemo(() => {
        return (
            <IonButton
                expand="block"
                type="button"
                onClick={handleCreateTransfer}
                className="btn-koinku"
                color="primary"
            >
                {translate('page.body.internal.transfer.continue')}
            </IonButton>
        );
    }, [username, otp, amount, currency, handleCreateTransfer, translate]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>Internal Transfers</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <div className='content'>
                    <div className='mt-4'>
                        <InternalTransferInput
                            field={translationUsername}
                            handleChangeInput={setUsername}
                            value={username}
                        />
                    </div>
                    <div className='mt-2'>
                        <label className="label" htmlFor="city5">Currency</label>
                        <IonList>
                            <IonItem>
                                <IonSelect interface="action-sheet" placeholder="Select Currency" style={{width: '100%'}} onIonChange={(e) => setCurrency(e.target.value)}>
                                    {walletsList.map((w) => ( 
                                        <IonSelectOption value={w}>{w.toUpperCase()}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                        </IonList>
                    </div>
                    <div
                        onClick={() => setAmount(wallet ? Decimal.format(wallet.balance, wallet.fixed, '.') : '')}
                        className={balanceError}
                    >
                        {translate('page.body.internal.transfer.account.balance')}
                        {wallet && wallet.balance && currency !== '' ? (
                            <Decimal fixed={wallet ? wallet.fixed : 0} thousSep=",">
                                {wallet.balance.toString()}
                            </Decimal>
                        ) : 0} {currency}
                        {(wallet && wallet.balance && +wallet.balance < +amount) ? (
                            translate('page.body.internal.transfer.insufficient.balance')
                        ) : null}
                    </div>
                    <div className='mt-2'>
                        <InternalTransferInput
                            field="amount"
                            handleChangeInput={setAmount}
                            value={amount}
                            fixed={wallet ? wallet.fixed : 0}
                        />
                    </div>
                    <div className='mt-2'>
                        <InternalTransferInput
                            field="otp"
                            handleChangeInput={setOtp}
                            value={otp}
                        />
                    </div>

                    <div className="mt-4">
                        <IonButton
                            expand="block"
                            type="button"
                            onClick={() => setShowDialog(!showDialog)}
                            className="btn-koinku"
                            color="primary"
                            disabled={!username || !otp || !(+amount) || !currency || !(wallet && wallet.balance && +wallet.balance >= +amount)}
                        >
                            {translate('page.body.internal.transfer.continue')}
                        </IonButton>
                    </div>

                </div>
            </IonContent>
            {showDialog && (
                <div
                    className="modal fade dialogbox show"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content pt-0">
                            <div className="modal-body mb-0">
                                <h3>Confirmation</h3>
                                {translate('page.body.internal.transfer.modal.content.transfer')}
                                <span><Decimal fixed={wallet ? wallet.fixed : 0} thousSep=",">{amount.toString()}</Decimal> {currency}</span> &nbsp;
                                {translate('page.body.internal.transfer.modal.content.to')}
                                <span>{username}</span>
                                {translate('page.body.internal.transfer.modal.content.account')}                     
                            </div>
                            <div className="modal-footer">
                                <div className="btn-inline">
                                    <div className="btn btn-text-secondary" onClick={()=>setShowDialog(false)}>CLOSE</div>
                                    <div className="btn btn-text-danger" onClick={handleCreateTransfer}>SURE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}   
            {!user.otp && <div className="content p-1">
                {translate('page.body.internal.transfer.please.enable.2fa')}
                <div onClick={() => handleNavigateTo2fa(true)} className="bold text-primary">
                    Enable 2FA Now
                </div>
            </div>}
        </IonPage>
    );
};
export default InternalTransfer;
