import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ChangePasswordInternal } from '../../components';
import {
    changePasswordFetch,
    entropyPasswordFetch,
    selectCurrentPasswordEntropy,
 } from '../../modules';
 import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
 import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';

const ProfileChangePassword: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();

    const handleChangePassword = payload => {
        if (payload) {
            dispatch(changePasswordFetch(payload));
            history.push('/user/profile');
        }
    };

    const fetchCurrentPasswordEntropy = payload => {
        if (payload) {
            dispatch(entropyPasswordFetch(payload));
        }
    };

    const currentPasswordEntropy = useSelector(selectCurrentPasswordEntropy);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>{intl.formatMessage({ id: 'page.mobile.profile.changePassword.title' })}</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <ChangePasswordInternal
                    handleChangePassword={handleChangePassword}
                    currentPasswordEntropy={currentPasswordEntropy}
                    fetchCurrentPasswordEntropy={fetchCurrentPasswordEntropy}
                />
            </IonContent>
        </IonPage>
    );
};

export default ProfileChangePassword;
