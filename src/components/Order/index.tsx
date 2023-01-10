import React, { useCallback, useEffect, useState } from 'react';
import { Decimal, OrderForm } from '../';
import { FilterPrice } from '../../filters';
import { getAmount, getTotalPrice } from '../../helpers';
import './order.css'
import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';



export type FormType = 'buy' | 'sell';


export type DropdownElem = number | string | React.ReactNode;

export interface OrderProps {
    type: FormType;
    OrderMarketType: string;
    price: number | string;
    amount: number | string;
    available: number;
}

export type OnSubmitCallback = (order: OrderProps) => void;

export interface OrderComponentProps {
    /**
     * Amount of money in base currency wallet
     */
    availableBase: number;
    /**
     * Amount of money in quote currency wallet
     */
    availableQuote: number;
    /**
     * Callback which is called when a form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * If orderType is 'Market' this value will be used as price for buy tab
     */
    priceMarketBuy: number;
    /**
     * If orderType is 'Market' this value will be used as price for sell tab
     */
    priceMarketSell: number;
    /**
     * If orderType is 'Limit' this value will be used as price
     */
    priceLimit?: number;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    handleSendType?: (index: number, label: string) => void;
    /**
     * Index of tab to switch on
     */
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    orderTypes?: DropdownElem[];
    orderTypesIndex?: DropdownElem[];
    /**
     *
     */
    width?: number;
    /**
     * proposals for buy
     */
    bids: string[][];
    /**
     * proposals for sell
     */
    asks: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    /**
     * default tab index
     */
    defaultTabIndex?: number;
    isMobileDevice?: boolean;
    currentMarketFilters: FilterPrice[];
    translate: (id: string, value?: any) => string;
}

interface State {
    index: number;
    amountSell: string;
    amountBuy: string;
    OrderMarketType: string;
    showType: boolean;
}


export class Order extends React.Component<OrderComponentProps, State> {
    public state = {
        index: 0,
        amountSell: '',
        amountBuy: '',
        OrderMarketType: 'Limit',
        showType: false,
    };

    public componentDidUpdate(prevProps: OrderComponentProps) {
        
        const { defaultTabIndex } = this.props; 
        if (defaultTabIndex !== undefined && defaultTabIndex !== prevProps.defaultTabIndex) {           
            this.handleChangeTab(defaultTabIndex);
        }
    }


    public componentDidMount() {       
        const { defaultTabIndex } = this.props;         
        if (defaultTabIndex !== undefined) {
            this.handleChangeTab(defaultTabIndex);
        }
    }

    public render() {
        const {OrderMarketType} = this.state;
        
        const onChangeType = (type) => {       
            this.setState({OrderMarketType: type})
            this.setState({showType: false})
        }       

        return (
            <>
                <div className='pl-2 pr-2 pt-2'>
                    <div className='separate'>
                        <div>
                            <ul className="nav nav-tabs style1 m-0 pl-0" role="tablist">
                                <li className="nav-item" onClick={()=> this.handleChangeTab(0)}>
                                    <a className={this.state.index === 0 ? "nav-link active" : "nav-link"}>Buy</a>
                                </li>
                                <li className="nav-item" onClick={()=> this.handleChangeTab(1)}>
                                    <a className={this.state.index === 1 ? "nav-link active" : "nav-link"}>Sell</a>
                                </li>
                            </ul>
                        </div>
                        <IonList class='pt-0 pb-0 pl-2'>
                            <IonSelect interface="action-sheet" placeholder={OrderMarketType} onIonChange={(e) => onChangeType(e.target.value)}>
                                <IonSelectOption value="Limit">Limit</IonSelectOption>
                                <IonSelectOption value="Market">Market</IonSelectOption>
                            </IonSelect>
                        </IonList>
                    </div>
                    <div className='pt-2'>
                        {this.state.index  === 0 && this.getPanel('buy')}
                        {this.state.index  === 1 && this.getPanel('sell')}
                    </div>
                </div>
            </>
        )
    }

    public getPanel = (type: FormType) => {
        const {
            availableBase,
            availableQuote,
            disabled,
            priceMarketBuy,
            priceMarketSell,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            asks,
            bids,
            currentMarketFilters,
            isMobileDevice,
            listenInputPrice,
            translate,
        } = this.props;
        const { amountSell, amountBuy,OrderMarketType } = this.state;

        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        const priceMarket = this.isTypeSell(type) ? priceMarketSell : priceMarketBuy;
        const disabledData = this.isTypeSell(type) ? {} : { disabled };
        const amount = this.isTypeSell(type) ? amountSell : amountBuy;
        return (
            <OrderForm
                type={type}
                from={from}
                {...disabledData}
                to={to}
                available={available}
                priceMarket={priceMarket}
                priceLimit={priceLimit}
                onSubmit={this.props.onSubmit}
                currentMarketAskPrecision={currentMarketAskPrecision}
                currentMarketBidPrecision={currentMarketBidPrecision}
                totalPrice={this.getPrice(amount, priceMarket, proposals)}
                amount={amount}
                listenInputPrice={listenInputPrice}
                handleAmountChange={this.handleAmountChange}
                handleChangeAmountByButton={this.handleChangeAmountByButton}
                currentMarketFilters={currentMarketFilters}
                isMobileDevice={isMobileDevice}
                translate={translate}
                OrderMarketType={OrderMarketType}
            />
        )
    };

    private getPrice = (amount: string, priceMarket: number, proposals: string[][]) => {
        const amountConverted = amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        return getTotalPrice(amountConverted, priceMarket, proposals)
    }

    private handleChangeTab = (index: number, label?: string) => {
        if (this.props.handleSendType && label) {            
          this.props.handleSendType(index, label);
        }

        this.setState({
            index: index,
        });
    };

    private handleAmountChange = (amount, type) => {    
        if (type === 'sell') {
            this.setState({ amountSell: amount });
        } else {
            this.setState({ amountBuy: amount });
        }
    };

    private handleChangeAmountByButton = (value, orderType, price, type) => {
        const { bids, asks, availableBase, availableQuote } = this.props;
        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        let newAmount = '';
        switch (type) {
            case 'buy':
                switch (orderType) {
                    case 'Limit':
                        newAmount = available && +price ? (
                            Decimal.format(available / +price * value, this.props.currentMarketAskPrecision,".",",")
                        ) : '';

                        break;
                    case 'Market':
                        newAmount = available ? (
                            Decimal.format(getAmount(Number(available), proposals, value), this.props.currentMarketAskPrecision,".",",")
                        ) : '';

                        break;
                    default:
                        break;
                }
                break;
            case 'sell':
                newAmount = available ? (
                    Decimal.format(available * value, this.props.currentMarketAskPrecision,".",",")
                ) : '';

                break;
            default:
                break;
        }

        if (type === 'sell') {
            this.setState({ amountSell: newAmount });
        } else {
            this.setState({ amountBuy: newAmount });
        }
    };

    private isTypeSell = (type: string) => type === 'sell';
}
