/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CustomInput, CustomInputIcon } from "../";
import { captchaLogin } from "../../api/config";
import { EMAIL_REGEX, ERROR_INVALID_EMAIL } from "../../helpers";
import { GeetestCaptchaResponse } from "../../modules";
import { selectMobileDeviceState } from "../../modules/public/globalSettings";

import {
  IonHeader,
  IonPage,
  IonIcon,
  IonText,
  IonButton,
  IonContent,
} from "@ionic/react";
import { arrowBackOutline, lockClosed } from "ionicons/icons";
import "./SignIn.css";

export interface SignInProps {
  labelSignIn?: string;
  labelSignUp?: string;
  emailLabel?: string;
  passwordLabel?: string;
  receiveConfirmationLabel?: string;
  forgotPasswordLabel?: string;
  isLoading?: boolean;
  title?: string;
  onForgotPassword: (email?: string) => void;
  onConfirmationResend?: (email?: string) => void;
  onSignUp: () => void;
  onSignIn: () => void;
  className?: string;
  image?: string;
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  emailFocused: boolean;
  emailPlaceholder: string;
  passwordFocused: boolean;
  passwordPlaceholder: string;
  isFormValid: () => void;
  refreshError: () => void;
  handleChangeFocusField: (value: string) => void;
  changePassword: (value: string) => void;
  changeEmail: (value: string) => void;
  captchaType?: "recaptcha" | "geetest" | "none";
  renderCaptcha?: JSX.Element | null;
  reCaptchaSuccess?: boolean;
  geetestCaptchaSuccess?: boolean;
  captcha_response?: string | GeetestCaptchaResponse;
}

export const SignIn: React.FC<SignInProps> = ({
  email,
  emailError,
  emailPlaceholder,
  password,
  passwordError,
  passwordPlaceholder,
  isLoading,
  onSignUp,
  image,
  labelSignIn,
  labelSignUp,
  emailLabel,
  passwordLabel,
  emailFocused,
  passwordFocused,
  onForgotPassword,
  forgotPasswordLabel,
  refreshError,
  onSignIn,
  isFormValid,
  handleChangeFocusField,
  changePassword,
  changeEmail,
  captchaType,
  geetestCaptchaSuccess,
  reCaptchaSuccess,
  renderCaptcha,
}) => {
  const isMobileDevice = useSelector(selectMobileDeviceState);
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [iconInput, setIconInput] = React.useState("eye-outline");
  const [passwordType, setPasswordType] = React.useState("password");
  const [focusInput, setFocusInput] = React.useState("");

  const PASSWORD_REGEX =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$";

  const isValidForm = React.useCallback(() => {
    const isEmailValid = email.match(EMAIL_REGEX);
    return email && isEmailValid && password;
  }, [email, password]);

  const handleChangeEmail = React.useCallback(
    (value: string) => {
      changeEmail(value);
    },
    [changeEmail]
  );

  const handleChangePassword = React.useCallback(
    (value: string) => {
      changePassword(value);
    },
    [changePassword]
  );

  const handleFieldFocus = React.useCallback(
    (field: string) => {
      handleChangeFocusField(field);
    },
    [handleChangeFocusField]
  );

  const isButtonDisabled = React.useMemo(
    () =>
      !!(
        captchaLogin() &&
        captchaType !== "none" &&
        !(reCaptchaSuccess || geetestCaptchaSuccess)
      ),
    [reCaptchaSuccess, geetestCaptchaSuccess]
  );

  const handleSubmitForm = React.useCallback(() => {
    refreshError();
    onSignIn();
  }, [onSignIn, refreshError]);

  const handleValidateForm = React.useCallback(() => {
    isFormValid();
  }, [isFormValid]);

  const handleIconClick = React.useCallback(() => {
    iconInput === "eye-outline"
      ? setIconInput("eye-off-outline")
      : setIconInput("eye-outline");
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  }, [iconInput, passwordType]);

  const handleClick = React.useCallback(
    (e?: MouseEvent) => {
      if (e) {
        e.preventDefault();
      }
      if (!isValidForm()) {
        handleValidateForm();
      } else {
        handleSubmitForm();
      }
    },
    [handleSubmitForm, handleValidateForm, isValidForm]
  );

  const renderForgotButton = React.useMemo(
    () => (
      <div className="forgot-password">
        <IonText
          onClick={() => onForgotPassword(email)}
          className="bold my-1 ms-auto"
        >
          <small>{forgotPasswordLabel || "Forgot your password?"}</small>
        </IonText>
      </div>
    ),
    [forgotPasswordLabel, onForgotPassword, email]
  );

  const renderRegister = React.useMemo(
    () => (
      <div className="text-center">
        <small className="fw-bold">
          <span>
            {formatMessage({ id: "page.header.signIN.noAccountYet" })}
            <span
              onClick={() => history.push("/register")}
              className="text-primary"
            >
              &nbsp;&nbsp;
              {formatMessage({ id: "page.body.landing.header.button3" })}
            </span>
          </span>
        </small>
      </div>
    ),
    [formatMessage, history]
  );

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div onClick={() => history.push("/user")}>
          <IonIcon className="text-white" icon={arrowBackOutline} />
        </div>

        <div className="mt-1 text-main">
          <h5 className="fw-bold">Heaven Exchange Login</h5>
          <div className="d-flex align-items-center">
            <IonIcon icon={lockClosed} className="mr-2" color="primary" />
            <span>
              <small className="fw-bold">
                https://www.heavenexchange.io/login
              </small>
            </span>
          </div>
        </div>
        <div className="section mt-4 mb-5">
          <form>
            <div className="mb-3">
              <CustomInput
                type="email"
                label={emailLabel || "Email"}
                placeholder={emailPlaceholder}
                defaultLabel="Email"
                handleChangeInput={handleChangeEmail}
                inputValue={email}
                handleFocusInput={() => handleFieldFocus("email")}
                autoFocus={!isMobileDevice}
                onKeyPress={(e) => setFocusInput("email")}
                error={emailError}
              />
              {!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) &&
              !emailFocused &&
              email.length ? (
                <IonText className="mt-1 text-warning">
                  {formatMessage({ id: ERROR_INVALID_EMAIL })}
                </IonText>
              ) : null}
            </div>

            <div className="mb-3">
              <CustomInputIcon
                type={passwordType}
                label={passwordLabel || "Password"}
                placeholder={passwordPlaceholder}
                defaultLabel="Password"
                handleChangeInput={handleChangePassword}
                inputValue={password}
                handleFocusInput={() => handleFieldFocus("password")}
                onKeyPress={() => handleFieldFocus("password")}
                classNameLabel="cr-email-form__label"
                classNameInput="input-icon"
                autoFocus={false}
                handleIconClick={handleIconClick}
                icon={iconInput}
                iconStyle="text-white"
              />
            </div>

            {captchaLogin() && <div className="mt-2 mb-2">{renderCaptcha}</div>}

            {renderForgotButton}

            <div className="form-button-group">
              <div className="d-grid">
                <IonButton
                  type="button"
                  fill="clear"
                  disabled={
                    !email.match(EMAIL_REGEX) || !password || isButtonDisabled
                  }
                  onClick={handleClick as any}
                  className="btn btn-primary text-white mt-3"
                >
                  {labelSignIn ? labelSignIn : "Sign in"}
                </IonButton>
                <div className="mt-1">{renderRegister}</div>
              </div>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
