import * as React from 'react';
import { useIntl } from 'react-intl';
import { Decimal,CodeVerification } from '../../components';
import { IonButtons, IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonPage } from '@ionic/react';

interface ModalWithdrawConfirmationProps {
    amount: string;
    currency: string;
    onSubmit: () => void;
    onChange?: (e) => void;
    onDismiss: () => void;
    onClose: () => void;
    rid: string;
    otpCode?: string;
    show: boolean;
    precision: number;
}

const ModalWithdraw = (props: ModalWithdrawConfirmationProps) => {
    const { formatMessage } = useIntl();
    const {
        otpCode,
        amount,
        currency,
        precision,
        rid,
        onClose,
        onSubmit,
        onChange,
    } = props;

    const renderHeader = React.useCallback(() => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation' })}
            </div>
        );
    }, [formatMessage]);

    return (
        props.show && ( 
            <div
                className="dialogbox"
                style={{ display: "block" }}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content pt-0">
                        <div className="modal-body mb-0">
                            <h3>{renderHeader()}</h3>
                            <div className='pt-2 pb-0'>
                                <div className='t5'>
                                    {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation.warning' })}
                                </div>
                                <div className='t5'>
                                    {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation.message1' })} {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation.message2' })}
                                </div>
                                <div className='t5 mt-2' style={{wordWrap: 'break-word'}}>{rid}</div>
                                <div className='t2'>
                                    {Decimal.format(amount, precision, ',')}  {currency.toUpperCase()}
                                </div>
                                <div>
                                    <label className='t5 mt-2 mb-2'>Enter 6 Digits code from 2FA</label>
                                    <CodeVerification
                                        code={otpCode}
                                        onChange={onChange}
                                        codeLength={6}
                                        type="text"
                                        placeholder="*"
                                        inputMode="decimal"
                                        showPaste2FA={false}
                                        isMobile={true}
                                    />                  
                                </div>
                            </div>     
                        </div>
                        <div className="modal-footer">
                            <div className="btn-inline">
                                <div className="btn btn-text-secondary" onClick={onClose}>CLOSE</div>
                                <div className="btn btn-text-danger" onClick={onSubmit}>SURE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export const ModalWithdrawConfirmation = React.memo(ModalWithdraw);
