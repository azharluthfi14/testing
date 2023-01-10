import classnames from 'classnames';
import * as React from 'react';
import {
    FilterPrice,
    PriceValidation,
    validatePriceStep,
} from '../../filters';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { OrderInput as OrderInputMobile } from '../../components';
import { Decimal } from '../Decimal';
import { OrderProps } from '../Order';
import { PercentageButton } from '../PercentageButton';
import { NumberFormatValues } from 'react-number-format';
import './OrderForm.css'
import { 
    IonButton,
} from '@ionic/react';

type OnSubmitCallback = (order: OrderProps) => void;
type FormType = 'buy' | 'sell';

export interface OrderFormProps {
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceMarket: number;
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceLimit?: number;
    /**
     * Type of form, can be 'buy' or 'cell'
     */
    type: FormType;
    /**
     * Available types of order
     */
    /**
     * Available types of order without translations
     */
    /**
     * Additional class name. By default element receives `cr-order` class
     * @default empty
     */
    className?: string;
    OrderMarketType: string;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Amount of money in a wallet
     */
    available?: number;
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    /**
     * Callback that is called when form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    totalPrice: number;
    amount: string;
    isMobileDevice?: boolean;
    currentMarketFilters: FilterPrice[];
    handleAmountChange: (amount: string, type: FormType) => void;
    handleChangeAmountByButton: (value: number, orderType: string, price: string, type: string) => void;
    translate: (id: string, value?: any) => string;
}

interface OrderFormState {
    price: string;
    priceMarket: number;
    isPriceValid: PriceValidation;
    amountFocused: boolean;
    priceFocused: boolean;
    showDialog: boolean;
    estimate: string;
    estimateFocused: boolean;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

export class OrderForm extends React.PureComponent<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            price: '',
            priceMarket: this.props.priceMarket,
            isPriceValid: {
                valid: true,
                priceStep: 0,
            },
            priceFocused: false,
            amountFocused: false,
            showDialog: false,
            estimateFocused: false,
            estimate: '',
        };
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.props.currentMarketBidPrecision);

        if (this.props.OrderMarketType === 'Limit' && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.handlePriceChange(nextPriceLimitTruncated);
        }

        if (this.state.priceMarket !== next.priceMarket) {
            this.setState({
                priceMarket: next.priceMarket,
            });
        }

        if (this.props.to !== next.to || this.props.from !== next.from) {
            this.setState({ price: '' });
            this.props.handleAmountChange('', next.type);
        }
    }

    public componentDidUpdate(prevProps: OrderFormProps) {
        const { totalPrice,OrderMarketType,amount,currentMarketBidPrecision } = this.props
        const { priceMarket,price } = this.state
        if(price === '' && OrderMarketType === 'Market'){
            this.handlePriceChange(Decimal.format(priceMarket,currentMarketBidPrecision,".",","))
        }        
        
        if(this.props.to !== prevProps.to){
            this.setState({estimate:''})
            this.props.handleAmountChange('', this.props.type); 
        }
        if(amount !== prevProps.amount && !this.state.estimateFocused){
            const convertedAmount = amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
            const convertedPrice = this.state.price.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
            if(Number(convertedPrice) > 0) {
                const estimate = Number(convertedPrice) * Number(convertedAmount)
                const estimatedConverted = Decimal.format(estimate, this.props.currentMarketBidPrecision,".",",")
                this.setState({estimate: estimatedConverted})
            }
        }
    }

    public render() {
        const {
            type,
            OrderMarketType,
            className,
            from,
            to,
            available,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            totalPrice,
            amount,
            isMobileDevice,
            translate,
        } = this.props;
        const {
            price,
            priceMarket,
            isPriceValid,
            priceFocused,
            amountFocused,
            estimateFocused,
            estimate,
        } = this.state;


        const safeAmount = Number(amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')) || 0;
        const safePrice = totalPrice / Number(safeAmount) || priceMarket;

        const total = OrderMarketType === 'Market'
            ? totalPrice : safeAmount * (Number(price) || 0);
        const amountPercentageArray = [0.25, 0.5, 0.75, 1];

        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;

        const priceErrorClass = classnames('error-message', {
            'error-message--visible': (priceFocused || isMobileDevice) && !isPriceValid.valid,
        });

        const priceText = this.props.translate('page.body.trade.header.newOrder.content.price');
        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');
        const submitButtonText = translate(`page.body.trade.header.newOrder.content.tabs.${type}`);
        const estimateText = `Amount in ${from.toUpperCase()}`;       
        
        return (
            <React.Fragment>
                <div className={classnames('cr-order-form', className)} onKeyPress={()=>this.handleEnterPress}>
                    {OrderMarketType === 'Limit' ? (
                        <div className="cr-order-item mb-1">
                                <OrderInputMobile
                                    label={priceText}
                                    placeholder={translate('page.mobile.order.price.placeholder', { currency: from ? from.toUpperCase() : '' })}
                                    value={price || ''}
                                    isFocused={priceFocused}
                                    precision={currentMarketBidPrecision}
                                    handleChangeValue={this.handlePriceChangeFilter}
                                    handleFocusInput={this.handleFieldFocus}
                                    decimalScale={currentMarketBidPrecision}
                                />
                            <div className={priceErrorClass}>
                                {translate('page.body.trade.header.newOrder.content.filterPrice', { priceStep: isPriceValid.priceStep })}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-1">
                            <div>
                                {priceText}
                            </div>
                            <div className="separate order-input-market">
                                <div className="">
                                    &asymp;<span className="cr-order-input__fieldset__input__price">
                                        {handleSetValue(Decimal.format(safePrice, currentMarketBidPrecision, ','), '0')}
                                    </span>
                                </div>
                                <div className="">
                                    {from.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="cr-order-item mb-1">
                        <OrderInputMobile
                            label={amountText}
                            placeholder={translate('page.mobile.order.amount.placeholder', { currency: to ? to.toUpperCase() : '' })}
                            value={amount || ''}
                            isFocused={amountFocused}
                            precision={currentMarketAskPrecision}
                            decimalScale={currentMarketAskPrecision}
                            handleChangeValue={this.handleAmountChangeFilter}
                            handleFocusInput={this.handleFieldFocus}
                        />
                    </div>
                    <div className='divider' />
                    <div className="cr-order-item mb-1">
                        <OrderInputMobile
                            label={estimateText}
                            placeholder={estimateText}
                            value={estimate || ''}
                            isFocused={estimateFocused}
                            precision={currentMarketBidPrecision}
                            handleChangeValue={this.handleEstimateChangeFilter}
                            handleFocusInput={this.handleFieldFocus}
                            decimalScale={currentMarketBidPrecision}

                        />
                    </div>
                    <div className="cr-order-item mb-2">
                        <div className="cr-order-item__percentage-buttons mb-1">
                            {
                                amountPercentageArray.map((value, index) => <PercentageButton
                                    value={value}
                                    key={index}
                                    onClick={this.handleChangeAmountByButton}
                                />)
                            }
                        </div>
                    </div>

                    <div className='info-order'>
                        <div className="cr-order-item">
                            <div className="cr-order-item__total">
                                <label className="cr-order-item__total__label fw-500 t-medium">
                                    {translate('page.body.trade.header.newOrder.content.total')}
                                </label>
                                <div className="bold">
                                    <span>
                                        {OrderMarketType === 'Market' ? <span>&asymp;</span> : null}
                                        {estimate ? estimate : 0}
                                    </span>
                                    <span className="bold ml-1">
                                        {from.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="cr-order-item">
                            <div className="cr-order-item__available">
                                <label className="cr-order-item__available__label fw-500 t-medium">
                                    {translate('page.body.trade.header.newOrder.content.available')}
                                </label>
                                <div className="bold">
                                    <span>
                                        {available ? Decimal.format(available, availablePrecision, ',') : 0}
                                    </span>
                                    <span className="bold ml-1">
                                        {availableCurrency.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="cr-order-item wd-100">
                        <IonButton
                            expand="block"
                            type="button"
                            disabled={this.checkButtonIsDisabled()}
                            className="btn-koinku wd-100"
                            onClick={this.confirmSubmit}
                            color={type === 'buy' ? 'success' : 'danger'}
                            >
                            {submitButtonText}
                        </IonButton>
                    </div>
                </div>
                {this.state.showDialog && (
                    <div
                        className="modal fade dialogbox show"
                        style={{ display: "block" }}
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content pt-0">
                                <div className="modal-body mb-0">
                                    Are you sure want to {type}  {amount} {to.toUpperCase()} with price {price} {from.toUpperCase()}
                                </div>
                                <div className="modal-footer">
                                    <div className="btn-inline">
                                        <a className="btn btn-text-secondary" onClick={()=>this.setState({showDialog: false})}>CLOSE</a>
                                        <a className="btn btn-text-danger" onClick={()=>this.handleSubmit()}>SURE</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }

    private handleFieldFocus = (field: string | undefined) => {
        const priceText = this.props.translate('page.body.trade.header.newOrder.content.price');
        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');
        const estimateText = `Amount in ${this.props.from.toUpperCase()}`;
        switch (field) {
            case priceText:
                this.setState(prev => ({
                    priceFocused: !prev.priceFocused,
                }));
                this.props.listenInputPrice && this.props.listenInputPrice();
                break;
            case amountText:
                this.setState(prev => ({
                    amountFocused: !prev.amountFocused,
                }));
                break;
            case estimateText:
                this.setState(prev => ({
                    estimateFocused: !prev.estimateFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handlePriceChangeFilter = (value: NumberFormatValues) => {
        const { currentMarketFilters } = this.props;
        const formatedValue = value.formattedValue
        const convertedValue = cleanPositiveFloatInput(String(formatedValue));
        this.setState({
            price: convertedValue,
            isPriceValid: validatePriceStep(convertedValue, currentMarketFilters),
        });
        this.handlePriceChange(value.formattedValue)
    };


    private handlePriceChange = (value: string) => {
        const { currentMarketBidPrecision, currentMarketFilters,amount } = this.props;
        this.setState({
            price: value,
            isPriceValid: validatePriceStep(value, currentMarketFilters),
        });

        const convertedAmount = amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')

        if(Number(convertedAmount) > 0){
            const convertedValue = value.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
            const total = Number(convertedValue || 0) * Number(convertedAmount)
            const val = Math.floor(total * Math.pow(10, currentMarketBidPrecision)) / Math.pow(10, currentMarketBidPrecision)               
            const convertedTotal =val.toLocaleString('fullwide', { useGrouping: false,maximumFractionDigits: currentMarketBidPrecision })
            const DecimalAmount = Decimal.format(val,this.countDecimals(convertedTotal),".",",")
            this.setState({estimate: DecimalAmount})        
        }  
        this.props.listenInputPrice && this.props.listenInputPrice();
    };

    private handleAmountChangeFilter = (value: NumberFormatValues) => {       
        const { currentMarketBidPrecision } = this.props;       
        const { price } = this.state;
        const convertedValue = String(value.formattedValue);
        this.props.handleAmountChange(convertedValue, this.props.type);
        const convertedPrice = price.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        
        if(Number(convertedPrice) > 0){
            const converted = convertedValue.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
            const total = Number(convertedPrice || 0) * Number(converted)           
            const val = Math.floor(total * Math.pow(10, currentMarketBidPrecision)) / Math.pow(10, currentMarketBidPrecision)               
            const convertedTotal =val.toLocaleString('fullwide', { useGrouping: false,maximumFractionDigits: currentMarketBidPrecision })
            const DecimalAmount = Decimal.format(val,this.countDecimals(convertedTotal),".",",")
            this.setState({estimate: DecimalAmount})        
        }
    };

    private handleChangeAmountByButton = (value: number) => {
        const { price } = this.state;
        const priceConverted = price.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const { OrderMarketType } = this.props;
        this.props.handleChangeAmountByButton(value, OrderMarketType, priceConverted, this.props.type);
        this.setState({estimateFocused: false})
    };

    private confirmSubmit = () => {
        this.setState({showDialog: true});
    };

    private countDecimals  = (value: string) => {
        if ((Number(value) % 1) != 0) 
            return value.toString().split(".")[1].length;  
        return 0;
    };

    private handleEstimateChangeFilter = (value: NumberFormatValues) => {
        const { currentMarketAskPrecision } = this.props;
        const { price } = this.state;
        const convertedValue = String(value.formattedValue);
        const converted = convertedValue.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const priceConverted = price.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        if(Number(priceConverted) > 0){
            const amount = Number(converted) / Number(priceConverted)
            const convertedAmount =amount.toLocaleString('fullwide', { useGrouping: false,maximumFractionDigits: currentMarketAskPrecision })
            const DecimalAmount = Decimal.format(amount,this.countDecimals(convertedAmount),".",",")
            this.setState({estimate: convertedValue})
            this.props.handleAmountChange(DecimalAmount, this.props.type);            
        }  
    };

    private handleSubmit = () => {
        const { available, type, amount,OrderMarketType } = this.props;
        const { price, priceMarket } = this.state;

        const order = {
            type,
            OrderMarketType,
            amount,
            price: OrderMarketType === 'Market' ? priceMarket : price,
            available: available || 0,
        };
        this.setState({showDialog: false});
        this.props.onSubmit(order);
        this.handlePriceChange('');
        this.props.handleAmountChange('', this.props.type);
        this.setState({estimate: ''})
    };

    private checkButtonIsDisabled = (): boolean => {
        const { disabled, available, amount, totalPrice,OrderMarketType } = this.props;
        const { isPriceValid, priceMarket, price,estimate } = this.state;

        const amountConverted = amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const priceConverted = price.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const estimateConverted = estimate.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const safePrice = totalPrice / Number(amountConverted) || priceMarket;
        const invalidLimitPrice = OrderMarketType === 'Limit' && (Number(priceConverted) <= 0 || !isPriceValid.valid);
        const invalidMarketPrice = safePrice <= 0 && OrderMarketType === 'Market';
        const invalidTotal = Number(estimateConverted) <= 0;        
        const invalidAmount = Number(amountConverted) <= 0;
        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice || invalidTotal;
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmSubmit();
        }
    };
}
