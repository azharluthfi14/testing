import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Decimal } from '../../components';
import { useUserWithdrawalsFetch, useFeeGroupFetch, useWithdrawLimits } from '../../hooks';
import {
    selectWithdrawLimits,
    selectFeeGroup,
    selectUserWithdrawalLimitsDay,
    selectUserWithdrawalLimitsMonth,    
} from '../../modules';
import { GLOBAL_PLATFORM_CURRENCY, DEFAULT_FIAT_PRECISION } from '../../constants';

interface UserWithdrawalLimitsProps {
    currencyId: string;
    price: string;
    fixed: number;
}

export const UserWithdrawalLimits = React.memo((props: UserWithdrawalLimitsProps) => {
    const { fixed, price, currencyId } = props;
    useUserWithdrawalsFetch();
    useFeeGroupFetch();
    useWithdrawLimits();

    const withdrawLimit = useSelector(selectWithdrawLimits);
    const usedWithdrawalLimitDay = useSelector(selectUserWithdrawalLimitsDay);
    const usedWithdrawalLimitMonth = useSelector(selectUserWithdrawalLimitsMonth);
    const feeGroup = useSelector(selectFeeGroup);

    const currentUserWithdrawalLimitGroup = withdrawLimit?.find(item => item.group === feeGroup.group) || withdrawLimit?.find(item => item.group === 'any');

    const estimatedValueDay = (+currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay) / +price;
    const estimatedValueMonth = (+currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth) / +price;   

    const canvas = document.getElementsByClassName('cr-withdrawal-limits__group-arc');

    const renderTime = useCallback((period) => {
        switch (period) {
            case 'D':
                return 'in 24 hours';
            case 'M':
                return 'in 1 month';
            default:
                return;
        }
    }, []);

    const renderArcBlock = useCallback((period, estimatedValue, limit) => {
        const est = Math.max(Number(estimatedValue),0)
        return (
            <div className="cr-withdrawal-limits__group">
                <div className="cr-withdrawal-limits__group-info">
                    <div className="cr-withdrawal-limits__group-info-usdt">
                        <Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{limit?.toString()}</Decimal>&nbsp;{GLOBAL_PLATFORM_CURRENCY}
                        <span className="cr-withdrawal-limits__group-info-period">&nbsp;/{period}</span></div>
                    <div className="cr-withdrawal-limits__group-info-currency">
                        <Decimal fixed={fixed} thousSep=",">{est?.toString()}</Decimal>&nbsp;{currencyId?.toUpperCase()}
                        <span className="cr-withdrawal-limits__group-info-period">&nbsp;| {renderTime(period)}</span></div>
                </div>
            </div>
        );
    }, [price, fixed, usedWithdrawalLimitDay, usedWithdrawalLimitMonth, feeGroup, currentUserWithdrawalLimitGroup]);   

    return (
        <React.Fragment>
            <div className='mt-3'>
                <div className='separate-start'>
                    <div className='ml-1 t2'>Withdrawal Limit Information</div>
                </div>
            </div>
            <div className='mt-2'>
                {renderArcBlock('D', estimatedValueDay, Math.max(+currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay,0))}
                {renderArcBlock('M', estimatedValueMonth, Math.max(+currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth,0))}
            </div>
        </React.Fragment>
    );
});
