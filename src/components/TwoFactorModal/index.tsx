import cr from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { CustomInput } from '../../components/CustomInput';

export const TwoFactorModalComponent = props => {
    const [code2FA, setCode2FA] = React.useState('');
    const [code2FAFocus, setCode2FAFocus] = React.useState(false);
    const intl = useIntl();

    const handleToggle2FA = shouldFetch => {
        props.handleToggle2FA(code2FA, shouldFetch);
        setCode2FA('');
    };

    const renderModalBody = () => {
        const code2FAClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': code2FAFocus,
        });

        return (
            <div className="pg-exchange-modal-submit-body pg-exchange-modal-submit-body-2fa mb-2">
                <div className={code2FAClass}>
                    <CustomInput
                        type="text"
                        label={intl.formatMessage({id: 'page.mobile.twoFactorModal.subtitle'})}
                        placeholder="2FA code"
                        defaultLabel=""
                        handleFocusInput={() => setCode2FAFocus(true)}
                        onKeyPress={() => setCode2FAFocus(true)}
                        handleChangeInput={setCode2FA}
                        inputValue={code2FA}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
            </div>
        );
    };


    const isValid2FA = code2FA.match('^[0-9]{6}$');
    return (    
        props.showModal ? (
            <div
                className="modal fade dialogbox show"
                style={{ display: "block" }}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content pt-0">
                        <div className="modal-body mb-0">
                            <h3>{intl.formatMessage({ id: 'page.mobile.twoFactorModal.title' })}</h3>
                            <div className='pt-2 pb-0'>
                                {renderModalBody()}
                            </div>                        
                        </div>
                        <div className="modal-footer">
                            <div className="btn-inline">
                                <button className="btn btn-text-secondary text-danger" onClick={() => handleToggle2FA(false)}>CLOSE</button>
                                <button className="btn btn-text-secondary text-success" disabled={!isValid2FA} onClick={() => handleToggle2FA(true)}>{intl.formatMessage({id: 'page.mobile.twoFactorModal.send'})}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export const TwoFactorModal = React.memo(TwoFactorModalComponent);
