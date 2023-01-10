import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector} from 'react-redux';
import {
    beneficiariesActivate,
    beneficiariesResendPin,
    Beneficiary,
    selectMobileDeviceState,
} from '../../modules';
import { CustomInput } from '../CustomInput';
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
  } from '@ionic/react';

interface Props {
    beneficiariesAddData: Beneficiary;
    handleToggleConfirmationModal: () => void;
}

const BeneficiariesActivateModalComponent: React.FC<Props> = (props: Props) => {
    const { beneficiariesAddData } = props;

    const [confirmationModalCode, setConfirmationModalCode] = React.useState('');
    const [confirmationModalCodeFocused, setConfirmationModalCodeFocused] = React.useState(false);

    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const isMobileDevice = useSelector(selectMobileDeviceState);

    const handleChangeFieldValue = React.useCallback((key: string, value: string) => {
        setConfirmationModalCode(value);
    }, []);

    const handleChangeFieldFocus = React.useCallback((key: string) => {
        setConfirmationModalCodeFocused(v => !v);
    }, []);

    const handleClearModalsInputs = React.useCallback(() => {
        setConfirmationModalCode('');
        setConfirmationModalCodeFocused(false);
    }, []);

    const handleSubmitConfirmationModal = React.useCallback(() => {
        if (beneficiariesAddData) {
            const payload = {
                pin: confirmationModalCode,
                id: beneficiariesAddData.id,
            };

            dispatch(beneficiariesActivate(payload));
        }

        handleClearModalsInputs();
    }, [confirmationModalCode, dispatch, beneficiariesAddData, handleClearModalsInputs]);

    const handleResendConfirmationCode = React.useCallback(() => {
        if (beneficiariesAddData) {
            const payload = {
                id: beneficiariesAddData.id,
            };

            dispatch(beneficiariesResendPin(payload));
        }
    }, [beneficiariesAddData, dispatch]);

    const renderConfirmationModalBodyItem = React.useCallback((field: string, optional?: boolean) => {
        const focusedClass = classnames('cr-email-form__group', {
            'cr-email-form__group--focused': confirmationModalCodeFocused,
            'cr-email-form__group--optional': optional,
        });

        return (
            <div className={`${focusedClass} inputGroup mt-2`} key={field}>
                <CustomInput
                    type="text"
                    label={formatMessage({ id: `page.body.wallets.beneficiaries.confirmationModal.body.${field}` })}
                    placeholder={formatMessage({ id: `page.body.wallets.beneficiaries.confirmationModal.body.${field}` })}
                    defaultLabel={field}
                    handleChangeInput={value => handleChangeFieldValue(field, value)}
                    inputValue={confirmationModalCode}
                    handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
                    onKeyPress={() => handleChangeFieldFocus(`${field}Focused`)}
                    classNameLabel="cr-email-form__label label-confirmation-send"
                    classNameInput="cr-email-form__input input-confirmation-send"
                    autoFocus={true}
                />
                <div className='text-center'>
                    <IonButton
                        type="button"
                        onClick={handleResendConfirmationCode}
                        className="mt-2"
                        fill="clear"
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.resendButton' })}
                    </IonButton>
                </div>
            </div>
        )
    },  [confirmationModalCodeFocused, confirmationModalCode, formatMessage, handleChangeFieldFocus, handleChangeFieldValue]);

    const renderConfirmationModalBody = React.useCallback(() => {
        const isDisabled = !confirmationModalCode;

        return (
            <React.Fragment>
                <div className='cr-email-form__form-content pl-0 pr-0 pb-2'>
                    <div>{formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.text' })}</div>
                    {renderConfirmationModalBodyItem('confirmationModalCode')}
                </div>
                <div className="form-button-group" style={{ minHeight: 60 }}>
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={handleSubmitConfirmationModal}
                        className="btn-koinku"
                        color="primary"
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.button' })}
                    </IonButton>
                </div>
            </React.Fragment>
        );
    }, [confirmationModalCode, formatMessage, handleResendConfirmationCode, handleSubmitConfirmationModal, renderConfirmationModalBodyItem]);

    const renderContent = React.useCallback(() => {
        return (
            <div className="beneficiaries-confirmation-modal">
                <div className="cr-email-form">
                    {renderConfirmationModalBody()}
                </div>
            </div>
        );
    }, [isMobileDevice, renderConfirmationModalBody]);

    return (
        <div>
            {renderContent()}
        </div>
    );
};

const BeneficiariesActivateModal = React.memo(BeneficiariesActivateModalComponent);

export {
    BeneficiariesActivateModal,
};
