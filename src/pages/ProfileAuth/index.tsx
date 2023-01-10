import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectUserInfo, toggle2faFetch } from '../../modules/user/profile';
import { FormattedMessage } from 'react-intl';
import { ProfileTwoFactorAuthScreen } from '../../components';
import { TwoFactorModal } from '../../components';

import { 
    IonHeader, 
    IonPage, 
    IonIcon,
    IonContent,
    IonButton,
    IonModal,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonItem,
    IonToggle,
    IonLabel,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

const ProfileAuth: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();
    const user = useSelector(selectUserInfo);

    const handleToggle2FA = (code2FA, shouldFetch) => {      
        if (shouldFetch) {
            dispatch(toggle2faFetch({
                code: code2FA,
                enable: false,
            }));
            history.push('/user/profile');
        }
        setShowModal(false);
    };

    const handleNavigateTo2fa = React.useCallback((enable2fa: boolean) => {
        if (!enable2fa) {
            setShowModal(true);
        }
    }, []);

    const handleToggle2faOnOf = (e) => {        
        if (handleNavigateTo2fa) {
            handleNavigateTo2fa(!user.otp);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>{intl.formatMessage({ id: 'page.profile.kyc.title' })}</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                {user.otp && (
                    <div className='content pt-2'>
                        <div className='separate'>
                            <div className='text-large'><FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication" /></div>
                            <div>
                                <IonToggle color="primary" checked={user.otp ? true : false} onIonChange={(e)=>handleToggle2faOnOf(e.target.value)}></IonToggle>
                            </div>
                        </div>
                    </div>
                )}
                {!user.otp ? <ProfileTwoFactorAuthScreen/> : null}
            </IonContent>
            <div id='appCapsule' className='bg-body pb-0 bg-full'>
                <div className="cr-mobile-profile-auth">
                    <TwoFactorModal
                        showModal={showModal}
                        handleToggle2FA={handleToggle2FA}
                    />
                </div>
            </div>
        </IonPage>
    );
};

export default ProfileAuth;