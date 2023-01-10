import * as React from 'react';
import { useSelector } from 'react-redux';
import { VALUATION_PRIMARY_CURRENCY } from '../../constants';
import { estimateValueLocked,estimateValueTotal,estimateValueBalance } from '../../helpers/estimateValue';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from '../../hooks';
import { selectCurrencies, selectMarkets, selectMarketTickers, selectWallets } from '../../modules';
import { Decimal } from '../../components';

const EstimatedWalletValue = React.memo(() => {
    const wallets = useSelector(selectWallets) || [];
    const markets = useSelector(selectMarkets);
    const currencies = useSelector(selectCurrencies);
    const tickers = useSelector(selectMarketTickers);
    const totalValue = estimateValueTotal(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    const balanceValue = estimateValueBalance(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    const lockedValue = estimateValueLocked(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);

    useWalletsFetch();
    useMarketsFetch();
    useMarketsTickersFetch();

    const currenciesItem = currencies && currencies.find((i)=>i.id.toLowerCase() === VALUATION_PRIMARY_CURRENCY.toLowerCase()) || {precision: 0}
    const precision = currenciesItem.precision || 0
    
    return (
        <React.Fragment>
            <div className='mt-2'>
                <div className='text-small text-light'>Est Total holdings</div>
                <div className='text-large'>
                    {VALUATION_PRIMARY_CURRENCY.toUpperCase()} &nbsp;
                    <Decimal fixed={precision} thousSep="." floatSep=','>
                        {totalValue}
                    </Decimal>
               </div>
            </div>

            <div className='separate pb-2 pt-2'>
                <div>
                    <div className='text-small text-light'>Est Available Balance</div>
                    <div className='text-large'>
                        {VALUATION_PRIMARY_CURRENCY.toUpperCase()} &nbsp;
                        <Decimal fixed={precision} thousSep="." floatSep=','>
                            {balanceValue}
                        </Decimal>
                    </div>
                </div>
                <div>
                    <div className='text-small text-light'>Est Locked Balance</div>
                    <div className='text-large'>
                        {VALUATION_PRIMARY_CURRENCY.toUpperCase()} &nbsp;
                        <Decimal fixed={precision} thousSep="." floatSep=','>
                            {lockedValue}
                        </Decimal>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});

export const EstimatedValue = React.memo(EstimatedWalletValue);
