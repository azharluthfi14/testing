import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectCurrentMarket,selectUserInfo,selectUserLoggedIn } from '../../modules';
import { useHistory } from 'react-router';
import { 
    IonButton,
} from '@ionic/react';

const OrderButtonsComponent = props => {
    const intl = useIntl();
    const currentMarket = useSelector(selectCurrentMarket);
    const user = useSelector(selectUserInfo);
    const isLogin = useSelector(selectUserLoggedIn);
    const history = useHistory();

    if(!isLogin){
        return (
            <div className="form-button-group">
                <IonButton
                    expand="block"
                    type="button"
                    onClick={e => history.push('/login')}
                    className="btn-koinku"
                    color="primary"
                >
                    Please Login
                </IonButton>
            </div>
        )
    }


    if(user.level < 3) {
        return (
            <div className="form-button-group">
                <IonButton
                    expand="block"
                    type="button"
                    onClick={e => history.push('/user/profile/verification')}
                    className="btn-koinku"
                    color="primary"
                >
                    Verify Account
                </IonButton>
            </div>
        )
    }

    return (
        <div className="form-button-group pt-1 pb-1">
            <IonButton
                expand="block"
                type="button"
                onClick={e => props.redirectToCreateOrder(0)}
                className="btn-koinku"
                color="success"
            >
                {intl.formatMessage(
                    { id: 'page.mobile.orderButtons.buy' },
                    { base_unit: currentMarket ? currentMarket.base_unit : '' },
                )}
            </IonButton>
            <IonButton
                expand="block"
                type="button"
                onClick={e => props.redirectToCreateOrder(1)}
                className="btn-koinku"
                color="danger"
            >
                {intl.formatMessage(
                    { id: 'page.mobile.orderButtons.sell' },
                    { base_unit: currentMarket ? currentMarket.base_unit : '' },
                )}
            </IonButton>
        </div>
    );
};

export const OrderButtons = React.memo(OrderButtonsComponent);
