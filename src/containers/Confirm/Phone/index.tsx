import cr from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import PinInput from 'react-pin-input';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner,IonButton } from '@ionic/react';
import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';
import './Phone.css'

import {
    changeUserLevel,
    resendCode,
    RootState,
    selectVerifyPhoneSuccess,
    sendPhoneCode,
    sendCode,
    verifyPhone,
    userFetch,
    User,
    selectUserInfo
} from '../../../modules';

interface ReduxProps {
    verifyPhoneSuccess?: string;
    sendPhoneCodeStatus?: boolean;
    user: User;
}

interface PhoneState {
    phoneNumber: string;
    phoneNumberFocused: boolean;
    confirmationCode: string;
    confirmationCodeFocused: boolean;
    resendCode: boolean;
    isButtonDisabled: boolean;
    countDown: number;
    step: number;
}

interface DispatchProps {
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
    changeUserLevel: typeof changeUserLevel;
    userFetch: typeof userFetch;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

const second_button_disable = 60

class PhoneComponent extends React.Component<Props, PhoneState> {
    private timeID: NodeJS.Timeout;
    constructor(props: Props) {
        super(props);

        this.state = {
            phoneNumber: '',
            phoneNumberFocused: false,
            confirmationCode: '',
            confirmationCodeFocused: false,
            resendCode: false,
            isButtonDisabled: true,
            countDown: second_button_disable,
            step: 0,
        };
    }

    public componentDidUpdate(prevProps: Props) {
        const { history, verifyPhoneSuccess,sendPhoneCodeStatus } = this.props;
        const { step } = this.state;

        if ( prevProps.sendPhoneCodeStatus !== sendPhoneCodeStatus && step === 0) {           
            this.setState({step:1})
        } 

        if ( prevProps.verifyPhoneSuccess !== verifyPhoneSuccess) {           
            this.props.userFetch();           
            history.push('/user/profile/verification');
        }       
    }

    public componentWillUnmount() {
        clearInterval(this.timeID);
    }

    public tick() {
        this.setState({countDown : this.state.countDown - 1})
        if(this.state.countDown <= 0){
            this.setState({countDown: second_button_disable,isButtonDisabled: false})
            clearInterval(this.timeID)
        }
    }

    public render() {
        const {
            phoneNumber,
            phoneNumberFocused,
            confirmationCode,
            isButtonDisabled,
            step,
        } = this.state;

        const phoneNumberFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': phoneNumberFocused,
        });
        return (
            <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick = {() => window.history.back()}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>{this.translate('page.body.kyc.phone.phoneNumber')}</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <div className='content mt-2'>
                    {step === 0 && (
                        <div className="section mt-2 text-main mb-2">
                            <h2>{this.translate('page.body.kyc.phone.phoneNumber')}</h2>
                            <h4 className='mb-3'>We send an code to your phone, please check your sms and find the confirmation code we've sent you</h4>
                            <h4>Enter a mobile Number</h4>
                            <fieldset className={phoneNumberFocusedClass}>
                                <PhoneInput
                                    placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                                    value={phoneNumber}
                                    defaultCountry="ID"
                                    onKeyPress={this.handleSendEnterPress}
                                    onChange={this.handleChangePhoneNumber}
                                    type="tel"
                                    autoComplete="tel"
                                    autoFocus={true}
                                    handleFocusInput={this.handleFieldFocus('phoneNumber')}
                                />
                            </fieldset>
                            
                            <div className='mt-3'>
                                <IonButton
                                    expand="block"
                                    type="submit"
                                    onClick={this.handleSendCode}
                                    className="btn-koinku"
                                    color="primary"
                                    disabled={phoneNumber.length < 10}
                                >
                                    GET OTP
                                </IonButton>
                            </div>
                        </div>
                    )}
                    { step === 1 && (
                        <div className="section mt-5 text-main mb-2 text-center">
                            <h4 className='mb-3'>Enter 5 digits code we've sent to your number {this.state.phoneNumber}</h4>
                            <div className='mt-3 mb-2'>
                                <PinInput 
                                    length={5} 
                                    secret 
                                    onChange={this.handleChangeConfirmationCode}
                                    onComplete={this.handleChangeConfirmationCode}
                                    type="numeric" 
                                    inputMode="number"
                                    style={{padding: '5px'}}  
                                    autoSelect={true}
                                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                                />
                            </div>
                            <div>Don't receive a code ?</div>
                            <button className='font-weight-bold btn-send-again mb-2' style={{background: 'transparent',border:'none'}} onClick={this.handleSendCode} disabled={isButtonDisabled}>
                                Send code again {this.state.isButtonDisabled && `( ${this.state.countDown} )`}
                            </button>
                            <IonButton
                                expand="block"
                                type="button"
                                onClick={this.confirmPhone}
                                className="btn-koinku"
                                color="primary"
                                disabled={!confirmationCode}
                            >
                                 Verify
                            </IonButton>
                            <div className='mt-2' onClick={()=> this.changeNumber()}>Wrong Number? <span className='text-success font-weight-bold'>Change number</span></div>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
        );
    }

    private changeNumber = () => {
        this.setState({isButtonDisabled: false,countDown: second_button_disable,step: 0})
    };

    private handleFieldFocus = (field: string) => {
        return() => {
            switch (field) {
                case 'phoneNumber':
                    this.addPlusSignToPhoneNumber();
                    this.setState(prev => ({
                        phoneNumberFocused: !prev.phoneNumberFocused,
                    }));
                    break;
                case 'confirmationCode':
                    this.setState({
                        confirmationCodeFocused: !this.state.confirmationCodeFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private handleSendEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSendCode(event);
        }
    };

    private confirmPhone = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
            verification_code: String(this.state.confirmationCode),
        };
        this.props.verifyPhone(requestProps);
    };

    private addPlusSignToPhoneNumber = () => {
        if (this.state.phoneNumber.length === 0) {
            this.setState({
                phoneNumber: '+62',
            });
        }
    };

    private handleChangePhoneNumber = (value: string) => {
        if(value){                      
            if (this.inputPhoneNumber(value)) {
                this.setState({
                    phoneNumber: value,
                    resendCode: false,
                });
            }
        }
    };

    private handleChangeConfirmationCode = (value: string) => {
        if (this.inputConfirmationCode(value)) {
            this.setState({
                confirmationCode: value,
            });
        }
    };

    private inputPhoneNumber = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$');

        return condition.test(convertedText);
    };

    private inputConfirmationCode = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^\\d*?$');

        return condition.test(convertedText);
    };

    private handleSendCode = event => {
        event.preventDefault();
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
        };

        if (!this.state.resendCode) {
            this.props.sendCode(requestProps);
            this.setState({
                resendCode: true,
            });
        } else {
            this.props.resendCode(requestProps);
        }
        this.setState({isButtonDisabled: true})
        this.timeID = setInterval(() => this.tick(), 1000);
    };

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    verifyPhoneSuccess: selectVerifyPhoneSuccess(state),
    sendPhoneCodeStatus: sendPhoneCode(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        resendCode: phone => dispatch(resendCode(phone)),
        sendCode: phone => dispatch(sendCode(phone)),
        verifyPhone: payload => dispatch(verifyPhone(payload)),
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        userFetch: () => dispatch(userFetch()),
    });

export const Phone = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(PhoneComponent) as any; // tslint:disable-line
