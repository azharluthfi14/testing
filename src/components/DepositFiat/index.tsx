import * as React from 'react';
import {
    User,Wallet,alertPush
} from '../../modules';
import { useDispatch } from 'react-redux';
import { copy } from '../../helpers';
import { 
    IonLabel, 
    IonIcon, 
    IonSegment, 
    IonSegmentButton, 
    IonButton, 
} from '@ionic/react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import { copyOutline } from 'ionicons/icons';
import './style.css'

export interface DepositFiatProps {
    /**
     * Sets helper description
     */
    description: string;
    /**
     * Sets title describing the data displayed in children
     */
    title: string;
    uid: string;
    user: User;
    wallet?: Wallet;
    handleGenerateAddress?: () => void;
}


/**
 * Component to display bank account details which can be used for a
 * deposit
 */
const DepositFiat: React.FunctionComponent<DepositFiatProps> = (props: DepositFiatProps) => {
    const {
        user,
        wallet,
        handleGenerateAddress,
    } = props;
    const [isLoading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();

    if (user.level < 3) {
        return (
            <>
                <div className='text-center pt-4'>
                    <img src="/assets/images/padlock.png" alt="" style={{width: '80px'}}/>
                </div>
                <div className='text-center'>
                    {intl.formatMessage({ id: 'account.withdraw.not_permitted' })}
                </div>
                <div className="form-button-group">
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={() => history.push('/user/profile/verification')}
                        className="btn-koinku"
                        color="primary"
                    >
                        Go To Verification
                    </IonButton>
                </div>
            </>
        )
    }

    const doGenerate = () => {
        setLoading(true)
        handleGenerateAddress()
    };

    if(!wallet.virtual_account || wallet.virtual_account.length === 0) {
        return (
            <React.Fragment>
                <div className="cr-tab-content cr-tab-content__active">
                    <div className="error-page pt-4">
                        <img src="/assets/images/book.png" alt="deposit-fiat" className="imaged square w200" />
                        <h4>Please click button to generate virtual account</h4>
                    </div>
                </div>
                <div className="fixed-footer">
                    <div className="row">
                        <div className="col-12">
                            <IonButton
                                expand="block"
                                type="button"
                                onClick={doGenerate}
                                disabled={isLoading}
                                className="btn-koinku"
                                color="primary"
                            >
                                {isLoading && <span className="spinner-border spinner-border-sm mr-05" role="status" aria-hidden="true"></span>} Get Deposit address
                            </IonButton>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        )
    }

    const va = wallet.virtual_account
    const doCopy = (id) => {
        copy(id);
        dispatch(alertPush({ message: ['virtual.copied'], type: 'success' }));
    }


    return (
        <div className="cr-deposit-fiat">
            <h2>Deposit IDR</h2>
            <p>Payment method that available for</p>
            <div className=''>
                { va.map((bank,index) => (
                    <div className='separate border-bottom pt-2 pb-2 form-deposit'>
                        <div key={index}>
                            <div className='text-large'>{bank.bank}</div>
                            <div>{bank.name}</div>
                            <div className='separate-start'>
                                <div onClick={() => doCopy('bank-'+index)} className="bank-account">
                                    <input type="text" id={`bank-${index}`} value={bank.number} className="bank_number" readOnly={true} style={{width: ((bank.number.length + 1) * 10) + 'px'}}/>
                                </div>
                                <div onClick={() => doCopy('bank-'+index)} className='ml-1 mt-1 text-right' style={{cursor: 'pointer', height:'16px'}}>
                                    <IonIcon icon={copyOutline} className="copy-icon"/>
                                </div>
                            </div>
                        </div>
                        <div><img src={`/assets/images/bank/${bank.bank.toLowerCase()}.png`} alt={bank.bank} className="imaged" style={{height:'25px'}}/></div>
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export {
    DepositFiat,
};
