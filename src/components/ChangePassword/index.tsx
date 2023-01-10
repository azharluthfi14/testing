import * as React from 'react';
import { useIntl } from 'react-intl';
import { passwordMinEntropy } from '../../api/config';
import {
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../helpers';
import { CustomInput,CustomInputIcon } from '../';
import { useHistory } from 'react-router';
import { 
    IonHeader, 
    IonPage, 
    IonIcon,
    IonText,
    IonItem,
    IonButton,
    IonInput,
    IonLabel,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

const default_timer = 60

export const ChangePassword = props => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmationPassword, setConfirmationPassword] = React.useState('');
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);
    const [code, setCode] = React.useState('');
    const history = useHistory();
    const [iconInput, setIconInput] = React.useState('eye-outline');
    const [iconInputConfirm, setIconInputConfirm] = React.useState('eye-outline');
    const [passwordType, setPasswordType] = React.useState('password');
    const [passwordConfirmType, setPasswordConfirmType] = React.useState('password');
    
    const [timer, setTimer] = React.useState(default_timer);
    const [btnDisable, setBtnDisable] = React.useState(true);

    const intl = useIntl();

    const handleChangePassword = () => {
        const payload = props.hideOldPassword
        ? {
            password: newPassword,
            confirm_password: confirmationPassword,
            reset_password_token: code,
        } : {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmationPassword,
        };

        props.handleChangePassword(payload);

        setOldPassword('');
        setNewPassword('');
        setConfirmationPassword('');
        setConfirmPasswordFocus(false);
    };

    const handleChangeOTP = (e) => {                    
        if(e.target.value.length>6){
            return
        }
        setCode(e.target.value)
    }

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
        setPasswordPopUp(!passwordPopUp);
    };

    const translate = (key: string) => intl.formatMessage({id: key});

    const isValidForm = () => {
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;
        const isOldPasswordValid = (!props.hideOldPassword && oldPassword) || true;

        return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
    };

    React.useEffect(() => {
        if(btnDisable) {
            let intervalId = setInterval(() => {
                tick()           
            },1000)
            return(() => {
                clearInterval(intervalId)
            })
        }
    })

    const handleSend = (e) => {
        if (e) {
            e.preventDefault();
        }
        setBtnDisable(true)
        props.handleSendNewCode()
    }
    
    const tick = () => {
        setTimer(timer - 1)
        if(timer <= 1){
            setBtnDisable(false)
            setTimer(default_timer)
        }
    }

    const handleIconClick = React.useCallback(() => {
        iconInput === 'eye-outline' ? setIconInput('eye-off-outline') : setIconInput('eye-outline')
        passwordType === 'password' ? setPasswordType('text') : setPasswordType('password')
    }, [iconInput,passwordType]);
    

    const handleIconClickConfirm = React.useCallback(() => {
        iconInputConfirm === 'eye-outline' ? setIconInputConfirm('eye-off-outline') : setIconInputConfirm('eye-outline')
        passwordConfirmType === 'password' ? setPasswordConfirmType('text') : setPasswordConfirmType('password')
    }, [iconInputConfirm,passwordConfirmType]);


    const renderCode = () => {
        return (
            <>
                <div className='text-left mb-1'>
                    <IonLabel position="stacked">6 Digits OTP code from email</IonLabel>
                    <IonItem class='input-item ion-no-padding'>
                        <IonInput 
                            placeholder={"000000"}
                            autofocus={false}
                            type={'text'}
                            onIonInput={(e: any) => handleChangeOTP(e)}
                            readonly={false}
                            className="clear-input"
                            value={code}
                        />
                        <div className="clear-input float-right" slot="end">
                            <button 
                                className='btn p-0 btn-send f-11' 
                                style={{borderRadius:'4px',width:'80px',height:'25px'}} 
                                disabled={btnDisable}
                                onClick={(e)=>handleSend(e)}
                                > {!btnDisable ? 'Send again' : timer}
                            </button>
                        </div>
                    </IonItem>
                </div>

                <div className='mb-1'>
                    <CustomInputIcon
                        type={passwordType}
                        label={intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        placeholder="****************"
                        defaultLabel="Password"
                        handleChangeInput={handleChangeNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={handleFocusNewPassword}
                        onKeyPress={handleFocusNewPassword}
                        autoFocus={false}
                        handleIconClick={handleIconClick}
                        icon={iconInput}
                    />
                </div>

                {newPassword.length > 0 && (
                    <div className="input-info text-success text-left password-info">
                        <span className={`mr-1 ${newPassword.match(/[a-z]/) ? 'text-success' : 'text-warning'}`}>Least one Lowercase,</span>
                        <span className={`mr-1 ${newPassword.match(/[A-Z]/) ? 'text-success' : 'text-warning'}`}>Least one Uppercase,</span>
                        <span className={`mr-1 ${newPassword.match(/[0-9]/) ? 'text-success' : 'text-warning'}`}>Least one Number,</span>
                        <span className={`mr-1 ${newPassword.match(/[`!%@$&^*()]+/)  ? 'text-success' : 'text-warning'}`}>Least one special character</span>
                        <span className={`mr-1 ${newPassword.length > 7 ? 'text-success' : 'text-warning'}`}>Min 8 Character,</span>
                    </div>
                )}

                <div className='mb-1'>
                    <CustomInputIcon
                        type={passwordConfirmType}
                        label={intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        placeholder="****************"
                        defaultLabel="Password confirmation"
                        handleChangeInput={setConfirmationPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={() => setConfirmPasswordFocus(!confirmPasswordFocus)}
                        onKeyPress={() => setConfirmPasswordFocus(!confirmPasswordFocus)}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                        handleIconClick={handleIconClickConfirm}
                        icon={iconInput}
                    />
                </div>

                <div className="form-button-group">
                    <div className='footer-section'>
                        <IonButton
                            expand="block"
                            disabled={!isValidForm()}
                            onClick={handleChangePassword}
                            className="btn-koinku"
                            color="primary"
                        >
                            {intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.change'})}
                        </IonButton>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="login-form">
                <div className=' text-left'>                            
                    <div className='btn-back' onClick = {()=>history.push('/forgot_password')}>
                        <IonIcon icon={arrowBackOutline}/>
                    </div>
                    <div className="section mt-2 text-main">
                        <h2>Change Password</h2>
                        <h4>Please fill the form carefully</h4>
                    </div>
                </div>
                <div className="section mt-4 mb-5">
                    <form>
                        {renderCode()}
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
