import { History } from 'history';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { CustomInput } from '../../components';
import { copy, setDocumentTitle } from '../../helpers';
import { alertPush, RootState, selectMobileDeviceState } from '../../modules';
import {
    generate2faQRFetch,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
} from '../../modules/user/profile';
import './style.css'
import { 
    IonIcon,
    IonButton,
} from '@ionic/react';
import { personCircleOutline, searchOutline,copyOutline } from 'ionicons/icons';

interface RouterProps {
    history: History;
}

interface ReduxProps {
    barcode: string;
    qrUrl: string;
    success?: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    toggle2fa: typeof toggle2faFetch;
    generateQR: typeof generate2faQRFetch;
    fetchSuccess: typeof alertPush;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

interface State {
    otpCode: string;
}

class ToggleTwoFactorAuthComponent extends React.Component<Props, State> {
    public state = {
        otpCode: '',
    };

    public componentDidMount() {
        setDocumentTitle('Two factor authentication');
        const enable2fa = this.get2faAction();
        if (enable2fa) {
            this.props.generateQR();
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (!this.props.success && next.success) {
            this.handleNavigateToProfile();
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public doCopy = () => {
        copy('secret-2fa');
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    public render() {
        const enable2fa = this.get2faAction();

        return (
            <div className="pg-profile-two-factor-auth">
                {this.renderToggle2fa(enable2fa)}
            </div>
        );
    }

    private renderToggle2fa = (enable2fa: boolean) => {
        const {
            barcode,
            qrUrl,
        } = this.props;
        const { otpCode } = this.state;

        const secretRegex = /secret=(\w+)/;
        const secretMatch = qrUrl.match(secretRegex);
        const secret = secretMatch ? secretMatch[1] : null;
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;
        

        return (
            <div className="p-2 pg-profile-two-factor-auth__form p-0">
                <div className="section full">
                    <div className="pt-2">
                        <div className="comment-block">
                            <div className="item">
                                <div className="avatar">1</div>
                                <div className="in">
                                    <div className="text f-12">
                                        <span className="">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.1')}</span>
                                        <a target="_blank" rel="noopener noreferrer" href="https://apps.apple.com/app/google-authenticator/id388497605?mt=8">AppStore</a>
                                        <span className="cr-item-text"> {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.or')}</span>
                                        <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl">Google play</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section full">
                    <div className="pt-1 pb-2">
                        <div className="comment-block">
                            <div className="item">
                                <div className="avatar">2</div>
                                <div className="in">
                                    <div className="text">
                                        <span className="">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.2')}</span>
                                        <div className='text-warning'>
                                            <span className="font-12">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.3')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-3 pg-profile-two-factor-auth__body--barcode">
                    {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                </div>

                <div className="row m-0 pg-profile-two-factor-auth__copyablefield">
                    {enable2fa && secret && this.renderSecret(secret)}
                </div>

                <div className="section full">
                    <div className="pt-2">
                        <div className="comment-block">
                            <div className="item">
                                <div className="avatar">3</div>
                                <div className="in">
                                    <div className="text f-12">
                                        <span className="cr-item-text">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.4')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-2'>
                    <CustomInput
                        handleChangeInput={this.handleOtpCodeChange}
                        type="number"
                        inputValue={otpCode}
                        placeholder={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                        onKeyPress={this.handleEnterPress}
                        label={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                        defaultLabel=""
                    />
                </div>

                <div className="row p-0 mt-2">
                    <div className="col-12 m-0">
                        <IonButton
                            expand="block"
                            type="button"
                            className="btn-koinku wd-100"
                            onClick={submitHandler}
                            >
                            {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.enable')}
                        </IonButton>
                    </div>
                </div>
            </div>
        );
    };

    private renderTwoFactorAuthQR = (barcode: string) => {
        const src = `data:image/png;base64,${barcode}`;

        return barcode.length > 0 && <img alt="" className="pg-profile-two-factor-auth__qr" src={src} />;
    };

    private renderSecret = (secret: string) => {
        return (
            <div className="separate">
                <div className="text-left">
                    <div className="text-small">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.mfa')}</div>
                    <input
                        type="text"
                        id="secret-2fa"
                        className="mfa-key"
                        readOnly={true}
                        defaultValue={secret}
                    />
                </div>
                <div onClick={()=>this.doCopy()}>
                    <IonIcon icon={copyOutline} />
                </div>
            </div>
        );
    };

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const enable2fa = this.get2faAction();
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;
        if (event.key === 'Enter') {
            event.preventDefault();
            submitHandler();
        }
    };

    private handleEnable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: true,
        });
    };

    private handleDisable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: false,
        });
    };

    private handleNavigateToProfile = () => {
        this.props.history.push('/user/profile');
    };

    private get2faAction = () => {
        const routingState = this.props.history.location.state as any;

        return routingState ? routingState.enable2fa : false;
    };

    private goBack = () => {
        window.history.back();
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, Props, RootState> = state => ({
    qrUrl: selectTwoFactorAuthQR(state),
    barcode: selectTwoFactorAuthBarcode(state),
    success: selectTwoFactorAuthSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

export const ProfileTwoFactorAuthScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ToggleTwoFactorAuthComponent) as React.ComponentClass;
