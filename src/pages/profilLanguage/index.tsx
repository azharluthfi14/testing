import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { languages } from '../../api/config';
import { getLanguageName } from '../../helpers';
import {
    changeLanguage,
    changeUserDataFetch,
    selectCurrentLanguage,
    selectUserInfo,
    selectUserLoggedIn,
} from '../../modules';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';

const ProfileLanguage: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const user = useSelector(selectUserInfo);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const currentLanguage = useSelector(selectCurrentLanguage);

    const handleChangeLanguage = (language: string) => {
        if (isLoggedIn) {
            const data = user.data && JSON.parse(user.data);

            if (data && data.language && data.language !== language) {
                const payload = {
                    ...user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                dispatch(changeUserDataFetch({ user: payload }));
            }
        }

        dispatch(changeLanguage(language));
    };

    const renderLanguageListItem = (language, index) => {
        return (
            <div
                key={index}
                className={`separate border-bottom pb-1 pt-1`}
                onClick={() => handleChangeLanguage(language)}
            >
                <div>{getLanguageName(language)}</div>
                {language === currentLanguage && (
                    <IonIcon icon={checkmarkOutline} className="font-20"></IonIcon>
                )}
            </div>
        );
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>Select Language</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <div className='content mt-2'>
                    {languages.map(renderLanguageListItem)}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProfileLanguage;
