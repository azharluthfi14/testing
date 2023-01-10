import * as React from 'react';
import { injectIntl } from 'react-intl';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { ChangePassword } from '../../components';
import { setDocumentTitle } from '../../helpers';
import {
    changeForgotPasswordFetch,
    changeLanguage,
    entropyPasswordFetch,
    RootState, selectChangeForgotPasswordSuccess,
    selectCurrentPasswordEntropy,
    selectMobileDeviceState,
    forgotPassword
} from '../../modules';
import { 
    IonHeader, 
    IonPage, 
    IonIcon,
    IonText,
    IonButton,
} from '@ionic/react';

interface ChangeForgottenPasswordState {
    confirmToken: string;
}

interface ReduxProps {
    changeForgotPassword?: boolean;
    isMobileDevice: boolean;
    currentPasswordEntropy: number;
}

interface DispatchProps {
    changeForgotPasswordFetch: typeof changeForgotPasswordFetch;
    changeLanguage: typeof changeLanguage;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
    forgotPassword: typeof forgotPassword;
}


interface HistoryProps {
    history: {
        location: {
            search: string;
            state: {
                email: string
            }
        };
    };
}

type Props = RouterProps & DispatchProps & HistoryProps & ReduxProps & IntlProps;

class Reset extends React.Component<Props, ChangeForgottenPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            confirmToken: '',
        };
    }

    public componentDidMount() {
        setDocumentTitle('Change forgotten password');
        const { history } = this.props;
        const token = new URLSearchParams(history.location.search).get('reset_token');
        const lang = new URLSearchParams(history.location.search).get('lang');
        const state = this.props.history.location.state || {email: null}
        if (token) {
            this.setState({
                confirmToken: token,
            });
        }
        if (lang) {
            this.props.changeLanguage(lang.toLowerCase());
        }
        if(!state.email){
            this.props.history.push('/login');
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.changeForgotPassword && (!this.props.changeForgotPassword)) {
            this.props.history.push('/login');
        }
    }

    public render() {
        const { isMobileDevice, currentPasswordEntropy } = this.props;
        return (
            <IonPage className="p-3 bg-body">
                <IonHeader>
                    <ChangePassword
                        handleSendNewCode={this.handleSendNewCode}
                        handleChangePassword={this.handleSendNewPassword}
                        title={!isMobileDevice && this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.title'})}
                        currentPasswordEntropy={currentPasswordEntropy}
                        fetchCurrentPasswordEntropy={this.props.fetchCurrentPasswordEntropy}
                        hideOldPassword={true}
                    />
                </IonHeader>
            </IonPage>
        );
    }

    private handleSendNewPassword = payload => {
        this.props.changeForgotPasswordFetch({
            ...payload,
            email: this.props.history.location.state.email || '',
        });
    };    
    
    private handleSendNewCode = () => {
        const email = this.props.history.location.state.email
        this.props.forgotPassword({email: email,resend: true})       
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    changeForgotPassword: selectChangeForgotPasswordSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeForgotPasswordFetch: credentials => dispatch(changeForgotPasswordFetch(credentials)),
        changeLanguage: lang => dispatch(changeLanguage(lang)),
        fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
        forgotPassword: credentials => dispatch(forgotPassword(credentials)),
    });

export default compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(Reset) as React.ComponentClass;
