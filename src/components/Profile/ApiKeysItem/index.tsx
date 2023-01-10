import * as React from 'react';
import { useIntl } from 'react-intl';
import { localeDate } from '../../../helpers';
import { 
    IonIcon,
    IonItem,
    IonToggle,
    IonLabel,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

const ApiKeysItemComponent = props => {
    const { index, item } = props;
    const intl = useIntl();

    const createdAt = localeDate(item.created_at, 'fullDate');
    return (
        <div className="wd-100 border-bottom">
            <div className='separate pt-2 pb-2'>
                <div style={{lineHeight:'5px'}}>
                    <IonToggle slot="end" checked={item.state === 'active'} onClick={() => props.handleUpdateKey(item)}></IonToggle>
                    <div className='capitalize bold'>{item.state}</div>
                </div>
                <div>
                    <div className='volume-title'>{intl.formatMessage({ id: 'page.mobile.profile.apiKeys.item.kid' })}</div>
                    <div>{item.kid}</div>
                </div>
                <div>
                    <div className='volume-title'>{intl.formatMessage({ id: 'page.mobile.profile.apiKeys.item.created' })}</div>
                    <div>{createdAt}</div>
                </div>
                <div className='text-warning' onClick={() => props.handleDeleteKey(item)}>
                    <IonIcon icon={trashOutline} className="icon-forward"/>
                </div>
            </div>
        </div>
    );
};

export const ApiKeysItem = React.memo(ApiKeysItemComponent);
