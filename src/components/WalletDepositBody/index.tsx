import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { DepositCrypto } from '../../components/DepositCrypto';
import { DepositFiat } from '../../components/DepositFiat';
import {
    Currency,
    selectCurrencies,
    walletsAddressFetch,
    selectUserInfo,
} from '../../modules';
import { 
    IonLabel, 
    IonSegment, 
    IonSegmentButton 
} from '@ionic/react';
import './style.css'

const WalletDepositBodyComponent = props => {
    const { wallet } = props;
    const intl = useIntl();
    const dispatch = useDispatch();
    const currencies: Currency[] = useSelector(selectCurrencies);
    const [tabIndex, setTabIndex] = useState(0);
    const user = useSelector(selectUserInfo);
    const label = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }), [intl]);
    const handleOnCopy = () => ({});
    const currencyItem: Currency | any = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };
    const [tab, setTab] = useState(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key : '');
    useEffect(() => {
        setTabIndex(0)
        setTab(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key?.toUpperCase() : '');
    }, [wallet.currency]);
    const depositAddress = wallet.deposit_addresses?.find(address => address.blockchain_key?.toLowerCase() === tab?.toLowerCase());
    const text = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
    { confirmations: currencyItem.min_confirmations });
    const error = intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.pending'});

    const title = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message1' });
    const description = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message2' });

    const buttonLabel = `${intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.button.generate' })} ${wallet.currency.toUpperCase()} ${intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.button.address' })}`;
    const handleGenerateAddress = () => {
        if (!depositAddress && wallet.type !== 'fiat') {
            dispatch(walletsAddressFetch({ currency: wallet.currency, blockchain_key: tab }));
        }
        if (wallet.type === 'fiat') {
            dispatch(walletsAddressFetch({ currency: wallet.currency, blockchain_key: '' }));
        }
    }
    let protocol
    const network =  currencyItem.networks || [] 
    if (wallet.type === 'coin')protocol = network.map(a => a.protocol.toUpperCase()) || [];

    const changeTab = (i) => {
        setTabIndex(i)
        setTab(currencyItem?.networks ? currencyItem?.networks[i]?.blockchain_key?.toUpperCase() : '');
    }

    const renderDeposit = () => {
        if (wallet.type === 'coin') {
            return (
                <React.Fragment>
                    {tab && (
                        <div className='separate'>
                            <div style={{width: '150px'}} className="text-large">Select Network</div>
                            <IonSegment value={protocol[tabIndex]} className='protocol-segment'>
                                {protocol.map((data,index)=>(
                                    <IonSegmentButton value={data} key={index} className="protocol-segment-item" onClick={()=>changeTab(index)}>{data}</IonSegmentButton>
                                ))}
                            </IonSegment>
                        </div>
                    )}

                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={`${wallet.currency.toUpperCase()} ${label}`}
                        copyButtonText={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.button'} )}
                        error={error}
                        handleGenerateAddress={() => handleGenerateAddress()}
                        handleOnCopy={handleOnCopy}
                        text={text}
                        wallet={wallet}
                        network={tab}
                        currencyNetwork={network}
                    />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <DepositFiat user={user} title={title} wallet={wallet} description={description} uid={user ? user.uid : ''} handleGenerateAddress={() => handleGenerateAddress()}/>
                </React.Fragment>
            );
        }
    };

    return (
        <div className="cr-mobile-wallet-deposit-body">
            {renderDeposit()}
        </div>
    );
};

const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export {
    WalletDepositBody,
};
