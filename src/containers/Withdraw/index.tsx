import classnames from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { IntlProps } from '../../';
import {
    Beneficiaries,
    SummaryField,
} from '../../components';
import './style.css'
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

import { Decimal } from '../../components/Decimal';
import { Beneficiary, BlockchainCurrencies } from '../../modules';
import { UserWithdrawalLimits } from './UserWithdrawalLimits';
import {
    Currency,
    Wallet,
    beneficiariesFetch,
} from '../../modules';
import { NumericFormat,NumberFormatValues } from 'react-number-format';

export interface WithdrawProps {
    currency: string;
    onClick: (amount: string, total: string, beneficiary: Beneficiary, otpCode: string, fee: string) => void;
    fixed: number;
    className?: string;
    type: 'fiat' | 'coin';
    price: string;
    name: string;
    twoFactorAuthRequired?: boolean;
    withdrawAmountLabel?: string;
    withdraw2faLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    withdrawDone: boolean;
    networks: BlockchainCurrencies[];
    isMobileDevice?: boolean;
    currencies?: Currency[];
    wallets?: Wallet[];
    handleClick?: (w) => void;
    handleClose?: (c) => void;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
    blockchain_name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WithdrawState {
    amount: string;
    beneficiary: Beneficiary;
    otpCode: string;
    withdrawAmountFocused: boolean;
    withdrawCodeFocused: boolean;
    total: string;
    showDialog: boolean;
}

interface DispatchProps {
    beneficiariesFetch: typeof beneficiariesFetch;
}

type Props = WithdrawProps & IntlProps & DispatchProps;

class WithdrawComponent extends React.Component<Props, WithdrawState> {
    public state = {
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawAmountFocused: false,
        withdrawCodeFocused: false,
        showDialog: false,
        total: '',
    };

    public componentWillReceiveProps(nextProps) {
        const { currency, withdrawDone } = this.props;
        if ((nextProps && (JSON.stringify(nextProps.currency) !== JSON.stringify(currency))) || (nextProps.withdrawDone && !withdrawDone)) {
            this.setState({
                amount: '',
                otpCode: '',
                total: '',
                beneficiary: defaultBeneficiary,
            });
        }
    }

    public componentDidUpdate(prev: Props) {
        const { currency } = this.props;
        
        if(prev.currency != currency){
            this.props.beneficiariesFetch()
        }
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public render() {
        const {
            amount,
            beneficiary,
            total,
            withdrawAmountFocused,
            otpCode,
        } = this.state;
        const {
            networks,
            currency,
            type,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
            fixed,
            price,
            name,
            wallets,
        } = this.props;

        const blockchainItem = networks?.find(item => item.blockchain_key === beneficiary.blockchain_key);

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
          'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });        
        
        const handleClick = (w) => {
            this.setState({showDialog: false})
            this.props.handleClick(w)
        }  
        
        const wallet = wallets.find(w=> w.currency.toLowerCase() === currency.toLowerCase()) || {balance: 0}
        const balance = wallet.balance      
        const amountConverted = this.state.amount.replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const minWithdraw = blockchainItem && blockchainItem.min_withdraw_amount || 0
                  
        return (
            <React.Fragment>
                <div className='withdraw-info pb-1 border-bottom'>
                    <div className='separate'>
                        <div>{this.translate('page.body.wallets.beneficiaries.min.withdraw')}</div>
                        <div className='bold'>
                            <Decimal fixed={fixed} thousSep="." floatSep=','>{minWithdraw.toString() || 0}</Decimal> 
                            &nbsp;{currency.toUpperCase()}
                        </div>
                    </div>

                    <div className='separate'>
                        <div>{this.translate('page.body.wallets.beneficiaries.fee')}</div>
                        <div className='bold'>
                            <Decimal fixed={fixed} thousSep="." floatSep=','>{blockchainItem?.withdraw_fee?.toString() || 0}</Decimal> 
                            {currency.toUpperCase()}
                        </div>
                    </div>

                    <div className='separate'>
                        <div>Balance</div>
                        <div className='bold'>
                            <Decimal fixed={fixed} thousSep="." floatSep=','>{balance.toString() || 0}</Decimal> {currency.toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="mt-2 mb-2">Please fill the form before make a withdrawal</div>
                <div className='mt-2 mb-3'>
                    <div>Withdrawal Address</div>
                    <Beneficiaries
                        currency={currency}
                        type={type}
                        onChangeValue={this.handleChangeBeneficiary}
                    />
                </div>

                <div className='cr-withdraw__input'>
                    <div>Withdrawal Amount</div>
                    <NumericFormat 
                        placeholder={withdrawAmountLabel || 'Amount'}
                        value={amount} 
                        allowLeadingZeros 
                        thousandSeparator="." 
                        decimalSeparator="," 
                        displayType="input" 
                        decimalScale={fixed} 
                        allowNegative ={false} 
                        className='input-element'
                        onValueChange={(values) => {
                            this.handleChangeInputAmount(values)
                        }}
                    />
                </div>
                { this.state.amount && (Number(amountConverted) > Number(balance)) && (
                    <div className='text-warning t5'>insufficient balance</div>
                )}
                <div className='mt-2'>
                    <SummaryField
                        className="cr-withdraw__summary-field"
                        message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
                        content={this.renderFee()}
                    />
                    <SummaryField
                        className="cr-withdraw__summary-field"
                        message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
                        content={this.renderTotal()}
                    />
                </div>

                <div className='mt-4'>
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={this.handleClick}
                        className="btn-koinku"
                        disabled={this.handleCheckButtonDisabled(total, beneficiary) || (Number(amountConverted) > Number(balance)) || Number(amountConverted) < Number(minWithdraw)}
                        color="primary"
                    >
                        {withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
                    </IonButton>
                </div>

                <div>
                    <UserWithdrawalLimits
                        currencyId={currency}
                        fixed={fixed}
                        price={price}
                    />
                </div>
            </React.Fragment>
        );
    }

    private handleCheckButtonDisabled = (total: string, beneficiary: Beneficiary) => {
        const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';
        return Number(total) <= 0 || !Boolean(beneficiary.id) || isPending;
    };

    private renderFee = () => {
        const { networks, fixed, currency } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = networks?.find(item => item.blockchain_key === beneficiary.blockchain_key);

        return (
            <span>
                <Decimal fixed={fixed} thousSep=",">{blockchainItem?.withdraw_fee?.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        );
    };

    private renderTotal = () => {
        const total = this.state.total;
        const { fixed, currency } = this.props;
        return total ? (
            <span>
                <Decimal fixed={fixed} thousSep="." floatSep=','>{total.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        ) : <span>0 {currency.toUpperCase()}</span>;
    };

    private handleClick = () => {
        const { networks } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = networks.find(item => item.blockchain_key === beneficiary.blockchain_key);

        this.props.onClick(
            this.state.amount,
            this.state.total,
            this.state.beneficiary,
            this.state.otpCode,
            blockchainItem.withdraw_fee?.toString(),
        );
    }
    
    private handleChangeInputAmount = (value: NumberFormatValues) => {
        var convertedAmount = value.formattedValue
        var floatValue = value.floatValue
        const { fixed, networks,currency,wallets } = this.props;

        const { beneficiary } = this.state;
        let fee = Number(0)
        
        const blockchainItem = networks.find(item => item.blockchain_key === beneficiary.blockchain_key); 
        fee = Number(blockchainItem.withdraw_fee)

        const total = (convertedAmount !== '') ? (floatValue - +fee).toFixed(fixed) : '';           
        if (Number(total) <= 0) {
            this.setTotal((0).toFixed(fixed));
        } else {
            this.setTotal(total);
        }

        this.setState({
            amount: convertedAmount,
        });
    };

    private setTotal = (value: string) => {
        this.setState({ total: value });
    };

    private handleChangeBeneficiary = (value: Beneficiary) => {       
        this.setState({
            beneficiary: value,
        });
    };
}

const mapDispatchToProps = dispatch => ({
    beneficiariesFetch: () => dispatch(beneficiariesFetch()),
});

export const Withdraw = compose(
    injectIntl,
    withRouter,
    connect(null, mapDispatchToProps),
)(WithdrawComponent) as any;
