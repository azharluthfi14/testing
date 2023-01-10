import React from 'react';
import { useIntl } from 'react-intl';
import { formatCCYAddress } from '../../helpers';
import {  Wallet } from '../../modules';
import { QRCode } from 'react-qrcode-logo';
import { copy } from '../../helpers';
import { useSelector,useDispatch } from 'react-redux';
import { 
    IonIcon,
    IonButton,
    IonSpinner,
} from '@ionic/react';
import { copyOutline } from 'ionicons/icons';

import './style.css'
import {
    BlockchainCurrencies,
    alertPush,
} from '../../modules';


export interface DepositCryptoProps {
    /**
     * Wallet
     */
    wallet: Wallet;
    /**
     * Blockchain
     */
        network: string;
    /**
     * Data which is used to display error if data is undefined
     */
    error: string;
    currencyNetwork?: BlockchainCurrencies[];
    /**
     * Defines the size of QR code component.
     * @default 118
     */
    dimensions?: number;
    /**
     *  Renders text of a component
     */
    text?: string;
    /**
     * @default 'Deposit by Wallet Address'
     * Renders text of the label of CopyableTextField component
     */
    copiableTextFieldText?: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;
    /**
     * Renders text alert about success copy address
     */
    handleOnCopy: () => void;
    /**
     * Generate wallet address for selected wallet
     */
    handleGenerateAddress: () => void;
    /**
     * Generate address button label
     */
    buttonLabel?: string;
    disabled?: boolean;
    minDepositAmount?: string;
}


/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const { formatMessage } = useIntl();
    const {
        buttonLabel,
        handleGenerateAddress,
        text,
        wallet,
        network,
        currencyNetwork,
    } = props;
       
    const depositAddress = wallet.deposit_addresses?.find(address => address.blockchain_key?.toLowerCase() === network?.toLowerCase());
    const dispatch = useDispatch();
    let networks
    if(network){
        networks = currencyNetwork.find(c=> c.blockchain_key.toLowerCase() === network.toLowerCase())
    }   

    const minDeposit = networks?.min_deposit_amount || 0
    const minConfirmation = networks?.min_confirmations || 0
    const depositEnabled = networks?.deposit_enabled || false
    
    const getDepositAddress = (addressData, currency) => {
        const address = addressData?.address?.split('?')[0];

        return address ? formatCCYAddress(currency, address) : '';
    };

    const walletAddress = getDepositAddress(depositAddress, wallet.currency);

    const doCopy = () => {
        copy('deposit-address')
        dispatch(alertPush({ message: ['addreess.copied'], type: 'success' }));
    };

    if (!depositEnabled) {
        return (
            <React.Fragment>
                <div className='text-center mt-4 pt-4'>
                    <div className="text-center empty-img">
                        <div>
                            <img src="/assets/images/padlock.png" alt="" className='no-data' />
                        </div>
                    </div>
                    <h5 className='mt-2 pb-0'>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.disabled'}, {currency: wallet?.currency.toUpperCase()})}</h5>
                </div>
            </React.Fragment>
        );
    }   

    if (!depositAddress) {
        return (
            <React.Fragment>
                <div className='text-center mt-4 pt-4'>
                    <div className="text-center empty-img">
                        <div>
                            <img src="/assets/images/no-data.png" alt=""  className='no-data'/>
                        </div>
                    </div>
                    <h5 className='mt-2 pb-0'>You don't have any address. Please generate first</h5>
                </div>
                <div className="form-button-group">
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={handleGenerateAddress}
                        className="btn-koinku"
                        color="primary"
                    >
                        {buttonLabel ? buttonLabel : 'Generate deposit address'}
                    </IonButton>
                </div>
            </React.Fragment>
        );
    }
   
    return (
        <React.Fragment>
            <div className='mt-4 text-center'>
                <div>{text}</div>
            </div>

            {!walletAddress && (
                <div className='text-center pt-3 pb-3'>
                    <IonSpinner name="bubbles"/>
                </div>
            )}

            {walletAddress && (
                <React.Fragment>
                    <div className='pt-3'>
                        {walletAddress ? (
                            <div className="qr-code-wrapper">
                                <QRCode value={walletAddress} logoImage={wallet.iconUrl} quietZone={10} size={130} logoHeight={35} logoWidth={35} />
                            </div>
                        ) : null}
                    </div>
                    <div className='text-center'>
                        <h5 className='mt-2 pb-0 t5 t-light'>Send only {wallet.currency.toUpperCase()} to this deposit address</h5>
                    </div>
                    <div className='text-address'>
                        {depositAddress.address} <span onClick={doCopy} className="ml-1  icon-copy-address">
                            <IonIcon icon={copyOutline} />
                        </span>
                    </div>
                    <input type="text" id="deposit-address" value={depositAddress?.address} className="deposit-title deposit-address" readOnly={true}/>
                    <div className="instruction-area">          
                        <div className='p-2 pt-1'>
                            <div className="border-warning mb-2">
                                <div className="card-body">
                                    <h5 className="t2" style={{marginLeft:'-15px'}}>Deposit Instructions</h5>
                                    <div className="card-text text-left">
                                        <ul className="a pl-0 text-instruction">
                                            <li>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.hint.title'}, {currency: wallet?.currency.toUpperCase()})}</li>
                                            <li>Sending coin or token other than {wallet.currency.toUpperCase()} to this address may result in the lost of your deposit</li>
                                            {minDeposit && (
                                                <li>Minimum deposit is <span className='text-warning'>{minDeposit}</span> {wallet.currency.toUpperCase()}</li>
                                            )}
                                                    
                                            {minConfirmation && (
                                                <li>Coins will be deposited immediately after <span className='text-warning'>{minConfirmation}</span> network confirmations</li>
                                            )}
                                            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export {
    DepositCrypto,
};
