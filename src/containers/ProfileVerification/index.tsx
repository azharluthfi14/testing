import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { kycSteps } from '../../api';
import { Label, labelFetch, selectLabelData, selectUserInfo, User } from '../../modules';
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
import { timeOutline,closeOutline,checkmarkOutline,checkmarkDoneOutline } from 'ionicons/icons';

interface ReduxProps {
    labels: Label[];
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

interface ProfileVerificationProps {
    user: User;
}

export interface ProfileProps {
    handleClick?: (e: any) => void;
}


type Props = DispatchProps & ProfileVerificationProps & ReduxProps & ProfileProps;

class ProfileVerification extends React.Component<Props> {
    public componentDidMount() {
        this.props.labelFetch();
    }

    public getIconKYC = (l: string) => {
        const { labels } = this.props;
        const label = labels.find(item => item.key === l) || {value: '',key: ''}
        const step = label.value || ''

        switch (step) {
            case 'verified':
                return (
                    <div className='text-success'>
                        <IonIcon icon={checkmarkDoneOutline}  className="icon-forward"></IonIcon>
                    </div>
                );
            case 'drafted':
            case 'pending':
            case 'submitted':
                return (
                    <div className='text-warning'>
                        <IonIcon icon={checkmarkOutline}  className="icon-forward"></IonIcon>
                    </div>
                );
            case 'rejected':
                return (
                    <div className='text-danger'>
                        <IonIcon icon={closeOutline}  className="icon-forward"></IonIcon>
                    </div>
                );
            case 'blocked':
                return (
                    <div className='text-danger'>
                        {/* <IonIcon name="close-outline" /> */}
                        <IonIcon icon={closeOutline}  className="icon-forward"></IonIcon>
                    </div>
                );
            default:
                return (
                    <div className='text-warning'>
                        <IonIcon icon={timeOutline}  className="icon-forward"></IonIcon>
                    </div>
                );
        }
    };

    public render() {   
        const level = this.props.user.level
        return (
            <React.Fragment>
                <div className='mt-5'>
                    <div className='text-uppercase mb-2'>Steps of Verification</div>
                    <div className='banner-verification'>
                        <div className='separate'>
                            <div className='separate-start'>
                                <div className='mr-2'>
                                    <img src="/assets/images/email.png" alt="email" />
                                </div>
                                <div>
                                    <div className='banner-verification__title'>Email Address</div>
                                    <div className='banner-verification__subtitle'>Confirm your email address.</div>
                                </div>
                            </div>
                            <div className='wd-40p banner-verification__icon'>
                                {this.getIconKYC('email')}
                            </div>
                        </div>
                    </div>
                    <div className='banner-verification'>
                        <div className='separate'>
                            <div className='separate-start'>
                                <div className='mr-2'>
                                    <img src="/assets/images/kyc.png" alt="kyc" />
                                </div>
                                <div>
                                    <div className='banner-verification__title'>Phone Number</div>
                                    <div className='banner-verification__subtitle'>Secure your account with phone number.</div>
                                </div>
                            </div>
                            <div className='wd-40p banner-verification__icon'>
                                {this.getIconKYC('phone')}
                            </div>
                        </div>
                    </div>
                    <div className='banner-verification'>
                        <div className='separate'>
                            <div className='separate-start'>
                                <div className='mr-2'>
                                    <img src="/assets/images/documents.png" alt="documents" />
                                </div>
                                <div>
                                    <div className='banner-verification__title'>Identity Card</div>
                                    <div className='banner-verification__subtitle'>Confirm Your identity card and start trading.</div>
                                </div>
                            </div>
                            <div className='wd-40p banner-verification__icon'>
                                {this.getIconKYC('document')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-button-group">
                    <div className='footer-section'>
                        <IonButton
                            expand="block"
                            onClick={(e) => this.props.handleClick(e)}
                            className="btn-koinku"
                            color="primary"
                        >
                            {level < 3 ? 'Continue' : 'Done' }
                        </IonButton>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    labels: selectLabelData(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    labelFetch: () => dispatch(labelFetch()),
});
export const ProfileVerificationMobile = connect(mapStateToProps, mapDispatchProps)(ProfileVerification);
