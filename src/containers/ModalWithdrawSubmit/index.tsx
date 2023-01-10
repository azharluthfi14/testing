import * as React from 'react';
import {
    FormattedMessage,
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../';
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
  } from '@ionic/react';

interface ModalWithdrawSubmitProps {
    currency: string;
    onSubmit: () => void;
    show: boolean;
    isMobileDevice?: boolean;
}

type Props = ModalWithdrawSubmitProps & IntlProps;

class ModalWithdrawSubmitComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        const { show } = this.props;
        return (
            <>
                 <IonPage>
                    <IonContent className="ion-padding bg-body">
                        {this.renderBodyModalSubmit()}
                        {this.renderFooterModalSubmit()}
                    </IonContent>
                </IonPage>
            </>
        )
    }

    private renderBodyModalSubmit = () => {
        return (
            <div className="text-center" style={{marginTop:'100px'}}>
                <div className='text-center mb-4'>
                    <img src="/assets/images/info.png" alt="" style={{width: '250px'}}/>
                </div>
                <div className='t1'>
                    <FormattedMessage id="page.modal.withdraw.success.message.content" />
                </div>
            </div>
        );
    };

    private renderFooterModalSubmit = () => {
        return (
            <div className="form-button-group">
                <IonButton
                    type="button"
                    onClick={this.props.onSubmit}
                    className="mt-2"
                    color="primary"
                >
                    {this.translate('page.modal.withdraw.success.button')}
                </IonButton>
            </div>
        );
    };
}

export const ModalWithdrawSubmit = injectIntl(ModalWithdrawSubmitComponent);
