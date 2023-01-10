import * as React from 'react';
import { IonInput,IonIcon, IonItem,IonButton,IonRow,IonGrid, IonLabel,IonNote } from '@ionic/react';
import { scanOutline } from 'ionicons/icons';

export interface CustomInputScanProps {
    type: string;
    label: string;
    defaultLabel?: string;
    handleChangeInput?: (value: string) => void;
    handleIconClick?: () => void;
    inputValue: string | number;
    handleFocusInput?: () => void;
    placeholder: string;
    classNameLabel?: string;
    classNameInput?: string;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    id?: string;
    handleClick?: ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void);
    isDisabled?: boolean;
    labelVisible?: boolean;
    autoComplete?: string;
    name?: string;
    error?: string;
    icon?: any;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}
type Props = CustomInputScanProps;

class CustomInputScan extends React.Component<Props> {
    public render() {
        const {
            placeholder,
            inputValue,
            type,
            autoFocus,
            readOnly,
            id,
            handleClick,
            isDisabled,
            onKeyPress,
            autoComplete,
            handleIconClick,
            name,
            error,
            icon,
            label,
        } = this.props;

        return (
            <div className='text-left'>
                <IonLabel position="stacked">{label}</IonLabel>
                <IonItem class='input-item ion-no-padding'>
                    <IonInput 
                        placeholder={placeholder}
                        autofocus={autoFocus}
                        type={'text'}
                        onFocus={this.props.handleFocusInput}
                        onBlur={this.props.handleFocusInput}
                        onIonInput={(e: any) => this.handleChangeValue(e)}
                        readonly={readOnly}
                        id={id}
                        disabled={isDisabled}
                        onKeyPress={(e: any) => onKeyPress(e)}
                        name={name}
                        className="clear-input"
                        value={inputValue ? inputValue.toString() : ''}
                    />
                    <IonIcon slot="end" className='user-icon' icon={scanOutline} onClick={handleIconClick}/>
                </IonItem>
            </div>
        );
    }

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };
}

export {
    CustomInputScan,
};
