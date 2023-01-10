import cr from "classnames";
import React, { FormEvent } from "react";
import { useSelector } from "react-redux";
import { CustomInput } from "../";
import { EMAIL_REGEX, ERROR_INVALID_EMAIL } from "../../helpers";
import { GeetestCaptchaResponse } from "../../modules";
import { selectMobileDeviceState } from "../../modules/public/globalSettings";
import { useIntl } from "react-intl";

import {
  IonIcon,
  IonButton,
  IonHeader,
  IonContent,
  IonFooter,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
export interface EmailFormProps {
  title?: string;
  buttonLabel?: string;
  errorMessage?: string;
  isLoading?: boolean;
  OnSubmit: () => void;
  className?: string;
  emailLabel?: string;
  email: string;
  message: string;
  emailError: string;
  emailFocused: boolean;
  placeholder?: string;
  validateForm: () => void;
  handleInputEmail: (value: string) => void;
  handleFieldFocus: () => void;
  handleReturnBack: () => void;
  captchaType?: "recaptcha" | "geetest" | "none";
  renderCaptcha?: JSX.Element | null;
  reCaptchaSuccess?: boolean;
  geetestCaptchaSuccess?: boolean;
  captcha_response?: string | GeetestCaptchaResponse;
  onGoBack?: () => void;
}

const EmailForm = React.memo((props: EmailFormProps) => {
  const isMobileDevice = useSelector(selectMobileDeviceState);

  const {
    title,
    buttonLabel,
    isLoading,
    emailLabel,
    email,
    emailFocused,
    emailError,
    captchaType,
    geetestCaptchaSuccess,
    reCaptchaSuccess,
    onGoBack,
  } = props;

  const handleSubmitForm = () => {
    props.OnSubmit();
  };
  const { formatMessage } = useIntl();

  const isValidForm = () => {
    const isEmailValid = email.match(EMAIL_REGEX);

    return email && isEmailValid;
  };

  const isButtonDisabled = (): boolean => {
    if (isLoading || !email.match(EMAIL_REGEX)) {
      return true;
    }

    if (captchaType === "recaptcha" && !reCaptchaSuccess) {
      return true;
    }

    if (captchaType === "geetest" && !geetestCaptchaSuccess) {
      return true;
    }

    return false;
  };

  const handleClick = (e: FormEvent<HTMLInputElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!isValidForm()) {
      props.validateForm();
    } else {
      handleSubmitForm();
    }
  };

  const emailGroupClass = cr("cr-email-form__group", {
    "cr-email-form__group--focused": emailFocused,
  });

  return (
    <>
      <IonHeader className="ion-padding">
        <div className="text-left">
          <div className="btn-back" onClick={onGoBack}>
            <IonIcon icon={arrowBackOutline} className="text-white" />
          </div>
        </div>
      </IonHeader>
      <IonContent className="ion-padding">
        <div>
          <h4>{title || "Forgot password"}</h4>
          <p>
            <small className="text-secondary">
              Please enter your email address or phone. You will receive a code
              to create a new password
            </small>
          </p>
        </div>

        <div className="section mt-4 mb-5">
          <div className={emailGroupClass}>
            <CustomInput
              type="email"
              label={emailLabel || "Email"}
              placeholder={emailLabel || "Email"}
              defaultLabel="Email"
              handleChangeInput={props.handleInputEmail}
              onKeyPress={() => props.handleInputEmail}
              inputValue={email}
              handleFocusInput={props.handleFieldFocus}
              classNameLabel="cr-email-form__label"
              classNameInput="cr-email-form__input"
              autoFocus={!isMobileDevice}
            />
            {email &&
            !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) &&
            !emailFocused &&
            email.length ? (
              <div className="input-info text-warning text-left">
                {formatMessage({ id: ERROR_INVALID_EMAIL })}
              </div>
            ) : null}
          </div>
          <div className="mt-4">{props.renderCaptcha}</div>

          <div className="mt-3">
            <button
              type="button"
              disabled={isButtonDisabled()}
              className="btn btn-primary"
              onClick={(e) => handleClick(e as any)}
            >
              {isLoading ? "Loading..." : buttonLabel ? buttonLabel : "Send"}
            </button>
          </div>
        </div>
      </IonContent>
    </>
  );
});

export { EmailForm };
