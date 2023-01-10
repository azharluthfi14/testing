import * as React from "react";
import { IonInput, IonItem, IonLabel, IonNote } from "@ionic/react";

export interface CustomInputProps {
  type: string;
  label: string;
  defaultLabel: string;
  handleChangeInput?: (value: string) => void;
  inputValue: string | number;
  handleFocusInput?: () => void;
  placeholder: string;
  classNameLabel?: string;
  classNameInput?: string;
  autoFocus?: boolean;
  errored?: string;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  id?: string;
  isDisabled?: boolean;
  labelVisible?: boolean;
  autoComplete?: boolean;
  name?: string;
  error?: string;
}

interface OnChangeEvent {
  target: {
    value: string;
  };
}
type Props = CustomInputProps;

class CustomInput extends React.Component<Props> {
  public render() {
    const {
      label,
      placeholder,
      inputValue,
      type,
      autoFocus,
      readOnly,
      id,
      isDisabled,
      onKeyPress,
      name,
      error,
      classNameInput,
    } = this.props;

    return (
      <div className="text-left">
        <IonItem className="ion-no-padding border-dark">
          <IonLabel position="floating">{label}</IonLabel>
          <IonInput
            placeholder={placeholder}
            autofocus={autoFocus}
            pattern={type}
            onFocus={this.props.handleFocusInput}
            onBlur={this.props.handleFocusInput}
            onIonInput={(e: any) => this.handleChangeValue(e)}
            readonly={readOnly}
            id={id}
            disabled={isDisabled}
            onKeyPress={(e: any) => onKeyPress(e)}
            name={name}
            className={classNameInput}
            value={inputValue ? inputValue.toString() : ""}
          ></IonInput>
        </IonItem>
      </div>
    );
  }

  private handleChangeValue = (e: OnChangeEvent) => {
    this.props.handleChangeInput &&
      this.props.handleChangeInput(e.target.value);
  };
}

export { CustomInput };
