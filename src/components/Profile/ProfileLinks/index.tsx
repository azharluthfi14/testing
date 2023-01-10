import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
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
    IonCheckbox,
    IonLabel,
} from '@ionic/react';
import { arrowBackOutline,chevronForwardOutline } from 'ionicons/icons';

const ProfileLinksComponent = props => {
    const intl = useIntl();
    const history = useHistory();
    const links = props.links || [];

    const handleRedirect = location => {
        if (history.location.pathname !== location.route) {
            history.push({
                pathname: location.route,
                state: location.state,
            });
        }
    };

    const renderLinkChildren = link => {
        if (link.children) {
            return (
                <div className="pg-mobile-profile-links__item__right">
                    {link.children}
                </div>
            );
        }

        return (
            <div className="pg-mobile-profile-links__item__right">
                <IonIcon icon={chevronForwardOutline} className="icon-forward"/>
            </div>
        );
    };

    const renderLinksItem = (link, index) => {
        return (
            <div
                key={index}
                className="pg-mobile-profile-links__item"
                onClick={() => handleRedirect(link)}
            >
                <span className="pg-mobile-profile-links__item__left">
                    {intl.formatMessage({id: link.titleKey})}
                </span>
                {renderLinkChildren(link)}
            </div>
        );
    };

    return (
        <div className="pg-mobile-profile-links">
            {links.length ? links.map(renderLinksItem) : null}
        </div>
    );
};

export const ProfileLinks = React.memo(ProfileLinksComponent);
