import classnames from 'classnames';
import * as React from 'react';
import { CustomInput } from '../';
import { copy } from '../../helpers';
import { IonInput,IonIcon, IonItem,IonButton,IonRow,IonGrid, IonLabel,IonNote } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';

export interface CopyableTextFieldProps {
    /**
     * Text value that will be copied to the clipboard
     */
    value: string;
    /**
     * Additional class name for styling. By default element receives `cr-button` class
     * @default empty
     */
    className?: string;
    /**
     * String value that makes copy field be unique
     */
    fieldId: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;
    /**
     * @default 'false'
     * If true, Button will be disabled.
     */
    disabled?: boolean;
    label?: string;
}

/**
 * Text field component with ability to copy inner text.
 */
class CopyableTextField extends React.Component<CopyableTextFieldProps> {
    public componentDidMount() {
        if (!this.props.fieldId) {
            throw new Error('CopyableTextField must contain `fieldId` prop');
        }
    }

    public render() {
        const {
            value,
            disabled,
            fieldId,
            label,
        } = this.props;
        const doCopy = () => copy(fieldId);

        return (
            <div className='text-left'>
                <IonLabel position="stacked">{label}</IonLabel>
                <IonItem class='input-item ion-no-padding'>
                    <input 
                        type="text" 
                        id={String(fieldId)}
                        readOnly={true}
                        disabled={disabled}
                        className="clear-input pl-1"
                        value={value}
                        autoFocus={false}
                        placeholder={label || ''}
                    />
                    <IonIcon slot="end" className='user-icon' icon={copyOutline} onClick={doCopy}/>
                </IonItem>
            </div>
        );
    }
}

export {
    CopyableTextField,
    copy,
};
