import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
    changeColorTheme,
    selectCurrentColorTheme,
} from '../../modules';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';

const COLOR_THEMES = ['dark', 'light'];

const ProfileTheme: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const currentColorTheme = useSelector(selectCurrentColorTheme);

    const handleChangeColorTheme = (colorTheme: string) => {
        if (colorTheme !== currentColorTheme) {
            dispatch(changeColorTheme(colorTheme));
        }
    };

    const renderThemeListItem = (colorTheme, index) => {
        return (
            <div
                key={index}
                className={`separate border-bottom pb-1 pt-1`}
                onClick={() => handleChangeColorTheme(colorTheme)}
            >
                <div>{intl.formatMessage({id: `page.mobile.profileColorTheme.theme.${colorTheme}`})}</div>
                {colorTheme === currentColorTheme && (
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
                        <IonTitle className='ion-text-center title-wallet text-large bold'>Select Themes</IonTitle>
                        <IonButtons slot="end"></IonButtons>
                    </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <div className='content mt-2'>
                    <div className="pg-mobile-profile-theme-screen__list">
                        {COLOR_THEMES.map(renderThemeListItem)}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProfileTheme;
