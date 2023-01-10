import cr from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { passwordMinEntropy } from '../../api/config';
import {
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../helpers';
import { CustomInputIcon } from '../';
import { 
    IonIcon,
    IonButton,
    IonSpinner,
} from '@ionic/react';

export const ChangePasswordInternalComponent = props => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmationPassword, setConfirmationPassword] = React.useState('');
    const [oldPasswordFocus, setOldPasswordFocus] = React.useState(false);
    const [newPasswordFocus, setNewPasswordFocus] = React.useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);
    const [iconInput, setIconInput] = React.useState('eye-outline');
    const [iconInputConfirm, setIconInputConfirm] = React.useState('eye-outline');
    const [passwordType, setPasswordType] = React.useState('password');
    const [passwordConfirmType, setPasswordConfirmType] = React.useState('password');

    const intl = useIntl();

    const handleChangePassword = () => {
        const payload = props.hideOldPassword
        ? {
            password: newPassword,
            confirm_password: confirmationPassword,
        } : {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmationPassword,
        };

        props.handleChangePassword(payload);

        setOldPassword('');
        setNewPassword('');
        setConfirmationPassword('');
        setOldPasswordFocus(false);
        setNewPasswordFocus(false);
        setConfirmPasswordFocus(false);
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (isValidForm()) {
                handleChangePassword();
            }
        }
    };

    const handleChangeNewPassword = (value: string) => {
        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(true);
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(false);
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(true);
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(false);
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(true);
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(false);
        }

        setNewPassword(value);
        setTimeout(() => {
            props.fetchCurrentPasswordEntropy({ password: value });
        }, 500);
    };

    const handleFocusNewPassword = () => {
        setNewPasswordFocus(!newPassword);
        setPasswordPopUp(!passwordPopUp);
    };

    const translate = (key: string) => intl.formatMessage({id: key});

    const isValidForm = () => {
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;
        const isOldPasswordValid = (!props.hideOldPassword && oldPassword) || true;

        return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
    };

    const handleIconClick = React.useCallback(() => {
        iconInput === 'eye-outline' ? setIconInput('eye-off-outline') : setIconInput('eye-outline')
        passwordType === 'password' ? setPasswordType('text') : setPasswordType('password')
    }, [iconInput,passwordType]);

    const handleIconClickConfirm = React.useCallback(() => {
        iconInputConfirm === 'eye-outline' ? setIconInputConfirm('eye-off-outline') : setIconInputConfirm('eye-outline')
        passwordConfirmType === 'password' ? setPasswordConfirmType('text') : setPasswordConfirmType('password')
    }, [iconInputConfirm,passwordConfirmType]);


    const renderBody = () => {
        const oldPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': oldPasswordFocus,
        });

        const newPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': newPasswordFocus,
        });

        const confirmPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': confirmPasswordFocus,
        });

        return (
            <div className="mt-2" onKeyPress={handleEnterPress}>
                {!props.hideOldPassword &&
                    <div className={oldPasswordClass}>
                        <CustomInputIcon
                            type={passwordType}
                            label={intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                            placeholder={intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                            defaultLabel="Old password"
                            handleChangeInput={setOldPassword}
                            inputValue={oldPassword}
                            handleFocusInput={() => setOldPasswordFocus(!oldPasswordFocus)}
                            classNameLabel="cr-email-form__label"
                            classNameInput="cr-email-form__input"
                            autoFocus={true}
                            handleIconClick={handleIconClick}
                            icon={iconInput}
                        />
                    </div>
                }
                <div className={newPasswordClass}>
                    <CustomInputIcon
                        type={passwordType}
                        label={intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        placeholder={intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        defaultLabel="New password"
                        handleChangeInput={handleChangeNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={handleFocusNewPassword}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                        handleIconClick={handleIconClick}
                        icon={iconInput}
                    />
                    {newPassword.length > 0 && (
                        <div className="input-info text-success text-left password-info mt-1">
                            <span className={`mr-1 ${newPassword.match(/[a-z]/) ? 'text-success' : 'text-warning'}`}>Least one Lowercase,</span>
                            <span className={`mr-1 ${newPassword.match(/[A-Z]/) ? 'text-success' : 'text-warning'}`}>Least one Uppercase,</span>
                            <span className={`mr-1 ${newPassword.match(/[0-9]/) ? 'text-success' : 'text-warning'}`}>Least one Number,</span>
                            <span className={`mr-1 ${newPassword.match(/[`!%@$&^*()]+/)  ? 'text-success' : 'text-warning'}`}>Least one special character</span>
                            <span className={`mr-1 ${newPassword.length > 7 ? 'text-success' : 'text-warning'}`}>Min 8 Character,</span>
                        </div>
                    )}
                </div>
                <div className={confirmPasswordClass}>
                    <CustomInputIcon
                        type={passwordConfirmType}
                        label={intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        placeholder={intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        defaultLabel="Password confirmation"
                        handleChangeInput={setConfirmationPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={() => setConfirmPasswordFocus(!confirmPasswordFocus)}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                        handleIconClick={handleIconClickConfirm}
                        icon={iconInput}
                    />
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="mt-3">
                <IonButton
                    expand="block"
                    type="button"
                    onClick={handleChangePassword}
                    className="btn-koinku"
                    color="primary"
                >
                    {intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.change'})}
                </IonButton>
            </div>
        );
    };

    return (
        <div className='content'>
            {renderBody()}
            {renderFooter()}
        </div>
    );
};

export const ChangePasswordInternal = React.memo(ChangePasswordInternalComponent);