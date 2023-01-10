import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Withdraw,ModalWithdrawSubmit } from '../../containers';
import { useBeneficiariesFetch } from '../../hooks';
import { selectCurrencies } from '../../modules/public/currencies';
import { Beneficiary } from '../../modules/user/beneficiaries';
import { selectUserInfo } from '../../modules/user/profile';
import { selectWithdrawSuccess, walletsWithdrawCcyFetch } from '../../modules/user/wallets';
import { ModalWithdrawConfirmation } from '../../components';
import {
    selectUserWithdrawalLimitsDay,
    selectFeeGroup,    
    selectUserWithdrawalLimitsMonth,    
    selectWithdrawLimits,    
    walletsReset,    
} from '../../modules';
import { Decimal } from '../Decimal';
import { 
    IonLabel, 
    IonIcon, 
    IonSegment, 
    IonContent, 
    IonButton, 
} from '@ionic/react';


const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
    blockchain_name: '',
    state: '',
    data: {
        address: '',
    },
};

const WalletWithdrawBodyComponent = props => {
    const [withdrawSubmitModal, setWithdrawSubmitModal] = React.useState(false);
    const [withdrawData, setWithdrawData] = React.useState({
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawConfirmModal: false,
        total: '',
        withdrawDone: false,
    });
    const [showDialog, setShowDialog] = React.useState(false);

    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const currencies = useSelector(selectCurrencies);
    const withdrawSuccess = useSelector(selectWithdrawSuccess);
    const { currency, type } = props.wallet;
    const fixed = (props.wallet || { fixed: 0 }).fixed;
    const withdrawAmountLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }), [intl]);
    const withdraw2faLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }), [intl]);
    const withdrawFeeLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }), [intl]);
    const withdrawTotalLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }), [intl]);
    const withdrawButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }), [intl]);
    const currencyItem = (currencies && currencies.find(item => item.id === currency));

    const usedWithdrawalLimitDay = useSelector(selectUserWithdrawalLimitsDay);
    const usedWithdrawalLimitMonth = useSelector(selectUserWithdrawalLimitsMonth);
    const feeGroup = useSelector(selectFeeGroup);
    const withdrawLimit = useSelector(selectWithdrawLimits);

    const price = currencyItem.price || 0
    const currentUserWithdrawalLimitGroup = withdrawLimit?.find(item => item.group === feeGroup.group) || withdrawLimit?.find(item => item.group === 'any');
    
    const estimatedValueDay = (+currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay) / +price;
    const estimatedValueMonth = (+currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth) / +price;  

    const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
        return level > 1 || (level === 1 && is2faEnabled);
    };

    const getConfirmationAddress = () => {
        let confirmationAddress = '';

        if (props.wallet) {
            confirmationAddress = props.wallet.type === 'fiat' ? (
                withdrawData.beneficiary.name
            ) : (
                withdrawData.beneficiary.data ? (withdrawData.beneficiary.data.address as string) : ''
            );
        }

        return confirmationAddress;
    };

    const toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {       
        const originalAmount = amount && amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        if(Number(originalAmount) > Number(estimatedValueDay) || Number(originalAmount) > Number(estimatedValueMonth)){
            setShowDialog(true)
        }else{
            setShowDialog(false)
            setWithdrawData((state: any) => ({
                amount: amount || '',
                beneficiary: beneficiary || defaultBeneficiary,
                otpCode: otpCode || '',
                withdrawConfirmModal: !state.withdrawConfirmModal,
                total: total || '',
                withdrawDone: false,
            }));
        }
    };

    const toggleSubmitModal = () => {
        setWithdrawSubmitModal(state => !state);
        setWithdrawData(state => ({ ...state, withdrawDone: true }));
        if(withdrawSubmitModal){
            dispatch(walletsReset());
        }
    };   
    
    const closeConfirmation = () => {
        setWithdrawData((state: any) => ({
            amount: '',
            beneficiary: defaultBeneficiary,
            otpCode: '',
            withdrawConfirmModal: false,
            total: '',
            withdrawDone: false,
        }));
    };

    const handleWithdraw = () => {
        const { otpCode, amount, beneficiary } = withdrawData;
        if (!props.wallet) {
            return;
        }
        const convertedAmount = amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const withdrawRequest = {
            amount: convertedAmount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: String(beneficiary.id),
        };
        dispatch(walletsWithdrawCcyFetch(withdrawRequest));
        toggleConfirmModal();
    };

    const handleClick = (w) => {
        history.push(`/user/wallets/${w.currency}/withdraw`)        
    }

    const handleClose = (c) => {
        history.push(`/user/wallets/${c}`)        
    }

    const renderOtpDisabled = () => {
        return (
            <>
                <div className='text-center pt-4'>
                    <img src="/assets/images/padlock.png" alt="" style={{width: '80px'}}/>
                </div>
                <div className='text-center'>
                    {intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2fa' })}
                </div>
                <div className="form-button-group">
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={() => history.push({pathname: '/user/profile/2fa',state: {enable2fa: true}})}
                        className="btn-koinku"
                        color="primary"
                    >
                        {intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2faButton'})}
                    </IonButton>
                </div>
            </>
        );
    };

    useBeneficiariesFetch();

    React.useEffect(() => {
        if (withdrawSuccess) {
            toggleSubmitModal();
        }
    }, [withdrawSuccess]);

    if (!user.otp) {
        return renderOtpDisabled();
    }

    const setOTP = (v) => {
        setWithdrawData(state => ({ ...state, otpCode: v }));
    }

    return (
        <React.Fragment>
            <IonContent className="ion-padding bg-body">
                <Withdraw
                    networks={currencyItem.networks}
                    currencies={currencies}
                    isMobileDevice
                    price={currencyItem.price}
                    name={currencyItem.name}
                    type={type}
                    fixed={fixed}
                    currency={currency}
                    onClick={toggleConfirmModal}
                    withdrawAmountLabel={withdrawAmountLabel}
                    withdraw2faLabel={withdraw2faLabel}
                    withdrawFeeLabel={withdrawFeeLabel}
                    withdrawTotalLabel={withdrawTotalLabel}
                    wallets={props.wallets}
                    withdrawDone={withdrawData.withdrawDone}
                    withdrawButtonLabel={withdrawButtonLabel}
                    handleClick={handleClick}
                    handleClose={handleClose}
                    twoFactorAuthRequired={isTwoFactorAuthRequired(user.level, user.otp)}
                />
            </IonContent>  

            
            <div className="cr-mobile-wallet-withdraw-body__submit">
                {withdrawSubmitModal && (
                    <ModalWithdrawSubmit
                        isMobileDevice
                        show={withdrawSubmitModal}
                        currency={currency}
                        onSubmit={toggleSubmitModal}
                    />
                )}
            </div>

            <div className="cr-mobile-wallet-withdraw-body__confirmation">
                <ModalWithdrawConfirmation
                    show={withdrawData.withdrawConfirmModal}
                    amount={withdrawData.total}
                    currency={currency}
                    precision={currencyItem ? currencyItem.precision : 0}
                    rid={getConfirmationAddress()}
                    onSubmit={handleWithdraw}
                    onDismiss={toggleConfirmModal}
                    onClose={closeConfirmation}
                    otpCode={withdrawData.otpCode}
                    onChange={(e)=>setOTP(e)}
                />
            </div>

            {showDialog && (
                <div
                    className="modal fade dialogbox show"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content pt-0">
                            <div className="modal-body mb-0">
                                <div className='pt-2 pb-2'>You've exceeded your withdrawal limit</div>                        
                                <div className='t5'>Available 24H Limit: {Decimal.format(Math.max(estimatedValueDay,0),currencyItem.precision,".",",") } {currency.toUpperCase()}</div>                        
                                <div className='t5'>Available 1M Limit: {Decimal.format(Math.max(estimatedValueMonth,0),currencyItem.precision,".",",") } {currency.toUpperCase()}</div>                        
                            </div>
                            <div className="modal-footer">
                                <div className="btn-inline">
                                    <div className="btn btn-text-success" onClick={()=>setShowDialog(false)}>CLOSE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}   
        </React.Fragment>
    );
};

const WalletWithdrawBody = React.memo(WalletWithdrawBodyComponent);

export {
    WalletWithdrawBody,
};
