import cr from 'classnames';
import * as React from 'react';
import { Decimal } from '../../components';
import { areEqualProps} from '../../helpers/areEqualProps';
import './orderInput.css'

/* Icons */
import { MinusIcon } from '../../assets/images/MinusIcon';
import { PlusIcon } from '../../assets/images/PlusIcon';
import { NumericFormat,NumberFormatValues } from 'react-number-format';
import { removeCircleOutline, addCircleOutline} from 'ionicons/icons';
import { 
    IonIcon,
} from '@ionic/react';


export interface OrderInputProps {
    className?: string;
    isFocused: boolean;
    isWrong?: boolean;
    label?: string;
    placeholder?: string;
    value: string | number;
    decimalScale?: number;
    precision: number;
    handleChangeValue: (text: NumberFormatValues) => void;
    handleFocusInput?: (value?: string) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const OrderInput: React.FunctionComponent<OrderInputProps> = React.memo((props: OrderInputProps) => {
    const {
        className,
        handleChangeValue,
        handleFocusInput,
        isFocused,
        isWrong,
        label,
        onKeyPress,
        placeholder,
        decimalScale,
        precision,
        value,
    } = props;
    const cx = cr('cr-order-input-mobile', className);

    const fieldsetFocusedClass = cr('cr-order-input-mobile__fieldset', {
        'cr-order-input-mobile__fieldset--focused': isFocused,
        'cr-order-input-mobile__fieldset--wrong': isWrong,
    });

    const handleChangeValueByButton = (increase: boolean) => {
        let updatedValue = value;
        const converted = value.toString().replace(/(\d)[\s.]+(?=\d)/g, '$1').replace(',', '.')
        const increasedValue = (+converted + (10 ** -precision)).toFixed(precision);
        const decreasedValue = (+converted - (10 ** -precision)).toFixed(precision);
        updatedValue = increase ?
            increasedValue :
            +decreasedValue >= 0 ? decreasedValue : updatedValue;

        const convertedValue = updatedValue.toString().replace(/(\d)[\s,]+(?=\d)/g, '$1').replace('.', ','); 
        const updateConverted:NumberFormatValues = {
            floatValue: parseFloat(updatedValue.toString()),
            formattedValue: convertedValue,
            value: updatedValue.toString(),
        }
        props.handleChangeValue(updateConverted);
    };

    return (
        <div className='separate orderinput'>
            <div onClick={() => handleChangeValueByButton(false)} className="icon-increase">
                <IonIcon icon={removeCircleOutline}/>
            </div>
            <div className='input-order-numeric'>
                <NumericFormat 
                    placeholder={placeholder || '0'}
                    value={value} 
                    allowLeadingZeros 
                    thousandSeparator="." 
                    decimalSeparator="," 
                    displayType="input" 
                    decimalScale={decimalScale} 
                    allowNegative ={false} 
                    className='form-control form-control-lg'
                    onFocus={()=>handleFocusInput(label)}
                    onValueChange={(values) => {
                        handleChangeValue(values)
                    }}
                />
            </div>
            <div onClick={() => handleChangeValueByButton(true)} className="icon-increase">
                <IonIcon icon={addCircleOutline}/>
            </div>
        </div>
    );
}, areEqualProps);
