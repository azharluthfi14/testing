import * as React from 'react';
import { Decimal } from '../Decimal';
import { DEFAULT_CCY_PRECISION,VALUATION_PRIMARY_CURRENCY } from '../../constants';
import { areEqualSelectedProps } from '../../helpers/areEqualSelectedProps';
import './item.css'

interface Props {
    wallet;
    tickers;
    onClick: (v: string) => void;
}

const WalletItemComponent = (props: Props) => {
    const {
        tickers,
        wallet: {
            currency = '',
            iconUrl = '',
            name,
            balance = 0,
            locked = 0,
            fixed = DEFAULT_CCY_PRECISION,
        }
    } = props;

    const getEstimation = (c,b) => {
        const pair = c.toLowerCase()+VALUATION_PRIMARY_CURRENCY.toLowerCase()
        const ticker = tickers[pair] || {last: 0}
        let price = Number(ticker.last) || 0
        if(VALUATION_PRIMARY_CURRENCY.toLowerCase() === c.toLowerCase())price=1
        return ((Number(b) || 0) * Number(price))
    }   
  
    return (
        <React.Fragment>
            <div className='separate mb-1 mt- 2 wallet_content' onClick={() => props.onClick(currency)}>
                <div className='wallet_content_item'>
                    <div className='wallet-image'>
                        {iconUrl ? (
                            <img src={iconUrl} alt={name}/> 
                        ) : <img src="https://s2.coinmarketcap.com/static/img/coins/128x128/9195.png" alt={name}/> }
                    </div>
                </div>
                <div className='wallet_content_item'>
                    <div>
                        <div className='text-small'>{name}</div>
                        <div className='uppercase'>{currency}</div>
                    </div>
                </div>
                <div className='wallet_content_item'>
                    <div>
                        <Decimal fixed={fixed} thousSep="." floatSep=','>
                            {locked}
                        </Decimal>
                    </div>
                    <div  className='font-11'>~ IDR &nbsp;
                        <Decimal fixed={0} thousSep="." floatSep=','>
                        {getEstimation(currency,locked)}
                        </Decimal>
                    </div>
                </div>
                <div className='wallet_content_item'>
                    <div>
                        <Decimal fixed={fixed} thousSep="." floatSep=','>
                            {balance}
                        </Decimal>
                    </div>
                    <div className='font-11'>~ IDR &nbsp;
                        <Decimal fixed={0} thousSep="." floatSep=','>
                            {getEstimation(currency,balance)}
                        </Decimal>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const WalletItem = React.memo(WalletItemComponent, areEqualSelectedProps('wallet', ['currency', 'name', 'balance', 'fixed']));

export {
    WalletItem,
};
