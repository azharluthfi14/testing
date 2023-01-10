import cr from "classnames";
import React, { useState, useRef } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CustomInput, CustomInputIcon } from "../";
import { isUsernameEnabled } from "../../api";
import { captchaType, passwordMinEntropy } from "../../api/config";
import { OverlayEventDetail } from "@ionic/core/components";
import {
  IonHeader,
  IonPage,
  IonIcon,
  IonContent,
  IonButton,
  IonModal,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonItem,
  IonCheckbox,
  IonLabel,
} from "@ionic/react";
import { arrowBackOutline, closeCircle } from "ionicons/icons";

import {
  EMAIL_REGEX,
  ERROR_LONG_USERNAME,
  ERROR_SHORT_USERNAME,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  ERROR_INVALID_EMAIL,
} from "../../helpers";
import { GeetestCaptchaResponse } from "../../modules";
import { selectMobileDeviceState } from "../../modules/public/globalSettings";
import "./SignUp.css";

export interface SignUpFormProps {
  isLoading?: boolean;
  title?: string;
  onSignUp: () => void;
  onSignIn?: () => void;
  className?: string;
  image?: string;
  labelSignIn?: string;
  labelSignUp?: string;
  usernameLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  referalCodeLabel?: string;
  termsMessage?: string;
  refId: string;
  password: string;
  username: string;
  email: string;
  confirmPassword: string;
  handleChangeUsername: (value: string) => void;
  handleChangeEmail: (value: string) => void;
  handleChangePassword: (value: string) => void;
  handleChangeConfirmPassword: (value: string) => void;
  handleChangeRefId: (value: string) => void;
  hasConfirmed: boolean;
  clickCheckBox: (e: any) => void;
  validateForm: () => void;
  emailError: string;
  passwordError: string;
  confirmationError: string;
  handleFocusUsername: () => void;
  handleFocusEmail: () => void;
  handleFocusPassword: () => void;
  handleFocusConfirmPassword: () => void;
  handleFocusRefId: () => void;
  confirmPasswordFocused: boolean;
  refIdFocused: boolean;
  usernameFocused: boolean;
  emailFocused: boolean;
  passwordFocused: boolean;
  renderCaptcha: JSX.Element | null;
  reCaptchaSuccess: boolean;
  geetestCaptchaSuccess: boolean;
  captcha_response?: string | GeetestCaptchaResponse;
  currentPasswordEntropy: number;
  passwordErrorFirstSolved: boolean;
  passwordErrorSecondSolved: boolean;
  passwordErrorThirdSolved: boolean;
  passwordPopUp: boolean;
  myRef: any;
  passwordWrapper: any;
  translate: (id: string) => string;
}

const SignUpFormComponent: React.FC<SignUpFormProps> = ({
  username,
  email,
  confirmPassword,
  refId,
  onSignIn,
  image,
  isLoading,
  labelSignIn,
  labelSignUp,
  usernameLabel,
  emailLabel,
  confirmPasswordLabel,
  passwordFocused,
  referalCodeLabel,
  termsMessage,
  geetestCaptchaSuccess,
  hasConfirmed,
  reCaptchaSuccess,
  currentPasswordEntropy,
  passwordPopUp,
  password,
  passwordLabel,
  emailError,
  translate,
  confirmationError,
  usernameFocused,
  emailFocused,
  passwordErrorFirstSolved,
  passwordErrorSecondSolved,
  confirmPasswordFocused,
  handleChangePassword,
  passwordErrorThirdSolved,
  handleFocusPassword,
  refIdFocused,
  validateForm,
  onSignUp,
  handleChangeUsername,
  handleFocusUsername,
  handleChangeEmail,
  handleFocusEmail,
  handleChangeConfirmPassword,
  handleFocusConfirmPassword,
  handleChangeRefId,
  handleFocusRefId,
  clickCheckBox,
  renderCaptcha,
}) => {
  const isMobileDevice = useSelector(selectMobileDeviceState);
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [showTOS, setShowTOS] = React.useState(false);
  const [passwordType, setPasswordType] = React.useState("password");
  const [passwordConfirmType, setPasswordConfirmType] =
    React.useState("password");
  const [iconInput, setIconInput] = React.useState("eye-outline");
  const [iconInputConfirm, setIconInputConfirm] = React.useState("eye-outline");
  const modal = useRef<HTMLIonModalElement>(null);

  const disableButton = React.useMemo((): boolean => {
    const captchaTypeValue = captchaType();

    if (
      isLoading ||
      !email.match(EMAIL_REGEX) ||
      !password ||
      !confirmPassword ||
      (isUsernameEnabled() && !username.match(USERNAME_REGEX))
    ) {
      return true;
    }

    if (captchaTypeValue === "recaptcha" && !reCaptchaSuccess) {
      return true;
    }

    if (captchaTypeValue === "geetest" && !geetestCaptchaSuccess) {
      return true;
    }

    return false;
  }, [
    captchaType,
    confirmPassword,
    username,
    email,
    geetestCaptchaSuccess,
    isLoading,
    password,
    reCaptchaSuccess,
  ]);

  const disableButtonTos = React.useMemo((): boolean => {
    const captchaTypeValue = captchaType();
    if (!hasConfirmed) {
      return true;
    }
    return false;
  }, [hasConfirmed]);

  const handleIconClick = React.useCallback(() => {
    iconInput === "eye-outline"
      ? setIconInput("eye-off-outline")
      : setIconInput("eye-outline");
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  }, [iconInput, passwordType]);

  const handleIconClickConfirm = React.useCallback(() => {
    iconInputConfirm === "eye-outline"
      ? setIconInputConfirm("eye-off-outline")
      : setIconInputConfirm("eye-outline");
    passwordConfirmType === "password"
      ? setPasswordConfirmType("text")
      : setPasswordConfirmType("password");
  }, [iconInputConfirm, passwordConfirmType]);

  const renderPasswordInput = React.useCallback(() => {
    const passwordGroupClass = cr("cr-sign-up-form__group", {
      "cr-sign-up-form__group--focused": passwordFocused,
    });

    return (
      <>
        <div className="mb-1">
          <CustomInputIcon
            type={passwordType}
            label={passwordLabel || "Password"}
            placeholder="****************"
            defaultLabel="Password"
            handleChangeInput={handleChangePassword}
            inputValue={password}
            handleFocusInput={handleFocusPassword}
            onKeyPress={handleFocusPassword}
            autoFocus={false}
            handleIconClick={handleIconClick}
            icon={iconInput}
            iconStyle="text-white"
          />
        </div>

        {password.length > 0 && (
          <div className="input-info text-success text-left password-info">
            <small>
              <span
                className={`mr-1 ${
                  password.match(/[a-z]/) ? "text-success" : "text-danger"
                }`}
              >
                Least one Lowercase,
              </span>
            </small>
            <small>
              <span
                className={`mr-1 ${
                  password.match(/[A-Z]/) ? "text-success" : "text-warning"
                }`}
              >
                Least one Uppercase,
              </span>
            </small>
            <small>
              <span
                className={`mr-1 ${
                  password.match(/[0-9]/) ? "text-success" : "text-warning"
                }`}
              >
                Least one Number,
              </span>
            </small>
            <small>
              <span
                className={`mr-1 ${
                  password.match(/[`!%@$&^*()]+/)
                    ? "text-success"
                    : "text-warning"
                }`}
              >
                Least one special character
              </span>
            </small>
            <small>
              <span
                className={`mr-1 ${
                  password.length > 7 ? "text-success" : "text-warning"
                }`}
              >
                Min 8 Character,
              </span>
            </small>
          </div>
        )}
      </>
    );
  }, [
    currentPasswordEntropy,
    password,
    passwordFocused,
    passwordLabel,
    passwordPopUp,
    handleChangePassword,
    handleFocusPassword,
    passwordErrorFirstSolved,
    passwordErrorSecondSolved,
    passwordErrorThirdSolved,
    translate,
  ]);

  const handleSubmitForm = React.useCallback(() => {
    onSignUp();
  }, [onSignUp]);

  const isValidForm = React.useCallback(() => {
    const isEmailValid = email.match(EMAIL_REGEX);
    const isPasswordValid = password.match(PASSWORD_REGEX);
    const isConfirmPasswordValid = password === confirmPassword;

    return (
      email &&
      isEmailValid &&
      password &&
      isPasswordValid &&
      confirmPassword &&
      isConfirmPasswordValid
    );
  }, [confirmPassword, email, password]);

  const handleClick = React.useCallback(
    (e?: React.FormEvent<HTMLInputElement>) => {
      if (e) {
        e.preventDefault();
      }
      setShowTOS(false);
      if (!isValidForm()) {
        validateForm();
      } else {
        handleSubmitForm();
      }
    },
    [handleSubmitForm, isValidForm, validateForm]
  );

  const renderUsernameError = (nick: string) => {
    return nick.length < 4
      ? translate(ERROR_SHORT_USERNAME)
      : translate(ERROR_LONG_USERNAME);
  };

  const renderLogIn = React.useCallback(() => {
    return (
      <div className="mt-2 text-center">
        <small className="fw-bold">
          <span>
            {formatMessage({ id: "page.header.signUp.alreadyRegistered" })}
            &nbsp;&nbsp;
            <span
              onClick={() => history.push("/login")}
              className="text-primary"
            >
              {formatMessage({ id: "page.mobile.header.signIn" })}
            </span>
          </span>
        </small>
      </div>
    );
  }, [history, formatMessage]);

  const handleRegister = React.useCallback(() => {
    setShowTOS(true);
  }, [history, formatMessage]);

  return (
    <IonPage>
      <IonContent className="bg-body">
        <div className="login-form p-3">
          <div className="text-left">
            <div className="btn-back" onClick={() => history.push("/")}>
              <IonIcon icon={arrowBackOutline} />
            </div>
            <div className="mt-2">
              <h5 className="fw-bold">Create Personal Account</h5>
            </div>
          </div>
          <div className="section mt-4 mb-5">
            <div className="mb-1">
              <CustomInput
                type="text"
                label={usernameLabel || "Username"}
                placeholder={usernameLabel || "Username"}
                defaultLabel="Username"
                handleChangeInput={handleChangeUsername}
                inputValue={username}
                handleFocusInput={handleFocusUsername}
                onKeyPress={handleFocusUsername}
                classNameLabel="cr-sign-up-form__label"
                classNameInput="cr-sign-up-form__input"
                autoFocus={!isMobileDevice}
                errored={renderUsernameError(username)}
              />
              {!username.match(USERNAME_REGEX) &&
              !usernameFocused &&
              username.length ? (
                <div className="input-info text-warning text-left">
                  {renderUsernameError(username)}
                </div>
              ) : null}
            </div>
            <div className="mb-1">
              <CustomInput
                type="email"
                label={emailLabel || "Email"}
                placeholder={emailLabel || "Email"}
                defaultLabel="Email"
                handleChangeInput={handleChangeEmail}
                inputValue={email}
                handleFocusInput={handleFocusEmail}
                onKeyPress={handleFocusEmail}
                classNameLabel="cr-sign-up-form__label"
                classNameInput="cr-sign-up-form__input"
                autoFocus={!isUsernameEnabled() && !isMobileDevice}
              />
              {!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) &&
              !emailFocused &&
              email.length ? (
                <div className="input-info text-warning text-left">
                  {formatMessage({ id: ERROR_INVALID_EMAIL })}
                </div>
              ) : null}
            </div>
            <div className="mb-1">{renderPasswordInput()}</div>
            <div className="mb-1">
              <CustomInputIcon
                type="password"
                label={confirmPasswordLabel || "Confirm Password"}
                placeholder={"****************"}
                defaultLabel="Confirm Password"
                handleChangeInput={handleChangeConfirmPassword}
                inputValue={confirmPassword}
                handleFocusInput={handleFocusConfirmPassword}
                onKeyPress={handleFocusConfirmPassword}
                classNameLabel="cr-sign-up-form__label"
                classNameInput="cr-sign-up-form__input"
                autoFocus={false}
                handleIconClick={handleIconClickConfirm}
                icon={iconInput}
                iconStyle="text-white"
              />
              {confirmationError && (
                <div className={"input-info text-warning text-left"}>
                  {confirmationError}
                </div>
              )}
            </div>
            <div className="mb-1">
              <CustomInput
                type="text"
                label={referalCodeLabel || "Referral code"}
                placeholder={referalCodeLabel || "Referral code"}
                defaultLabel="Referral code"
                handleChangeInput={handleChangeRefId}
                inputValue={refId}
                handleFocusInput={handleFocusRefId}
                onKeyPress={handleFocusRefId}
                classNameLabel="cr-sign-up-form__label"
                classNameInput="cr-sign-up-form__input"
                autoFocus={false}
              />
            </div>
            <div className="mb-1 mt-2">{renderCaptcha}</div>
          </div>
          <div className="mt-4">
            <IonButton
              fill="clear"
              type="button"
              disabled={disableButton}
              onClick={handleRegister}
              className="btn btn-primary text-white mt-3"
            >
              {isLoading ? "Loading..." : labelSignUp ? labelSignUp : "Sign up"}
            </IonButton>
          </div>
          {renderLogIn()}
        </div>
      </IonContent>

      <IonModal isOpen={showTOS}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowTOS(false)}>
                <IonIcon icon={closeCircle} />
              </IonButton>
            </IonButtons>
            <IonTitle>Term and Condition</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>
            <small>
              SYARAT – SYARAT DAN KETENTUAN UMUM Syarat – Syarat dan Ketentuan
              Umum (selanjutnya disebut sebagai “SKU”) INDODAX adalah ketentuan
              yang berisikan syarat dan ketentuan mengenai penggunaan produk,
              jasa, teknologi, fitur layanan yang diberikan oleh INDODAX
              termasuk, namun tidak terbatas pada penggunaan Website, Dompet
              Bitcoin Indonesia dan INDODAX Trading Platform (Trading App)
              (untuk selanjutnya disebut sebagai “Platform INDODAX”) sepanjang
              tidak diatur secara khusus sebagaimana tercantum pada bagian
              registrasi Akun INDODAX yang dibuat pada hari dan tanggal yang
              tercantum dalam bagian registrasi Akun https://indodax.com,
              merupakan satu kesatuan tidak terpisahkan dan persetujuan atas SKU
              ini. Dengan mendaftar menjadi Member/Verified Member, Anda
              menyatakan telah MEMBACA, MEMAHAMI, MENYETUJUI dan MEMATUHI
              Persyaratan dan Ketentuan di bawah. Anda disarankan membaca semua
              persyaratan dan ketentuan secara seksama sebelum menggunakan
              layanan platform INDODAX atau segala layanan yang diberikan, dan
              bersama dengan ini Anda setuju dan mengikatkan diri terhadap
              seluruh kegiatan dalam SKU ini dengan persyaratan dan ketentuan
              sebagai berikut : DEFINISI sepanjang konteks kalimatnya tidak
              menentukan lain, istilah atau definisi dalam SKU memiliki arti
              sebagai berikut : Website mengacu pada situs online dengan alamat
              https://indodax.com. Website ini dikelola oleh INDODAX, dengan
              tidak terbatas pada para pemilik, investor, karyawan dan
              pihak-pihak yang terkait dengan INDODAX. Tergantung pada konteks,
              “Website” dapat juga mengacu pada jasa, produk, situs, konten atau
              layanan lain yang disediakan oleh INDODAX. Aset Kripto adalah
              komoditas digital yang menggunakan prinsip teknologi
              desentralisasi berbasiskan jaringan peer-to-peer (antar muka)atau
              disebut dengan Jaringan Blockchain yang diperdagangkan di dalam
              platform Blockchain adalah sebuah buku besar terdistribusi
              (distributed ledger) terbuka yang dapat mencatat transaksi antara
              dua pihak secara efisien dan dengan cara yang dapat diverifikasi
              secara permanen. Registrasi adalah proses pendaftaran menjadi
              Member dalam platform INDODAX yang merupakan proses verifikasi
              awal untuk memperoleh keterangan, pernyataan dalam penggunaan
              layanan platform Member adalah orang (perseorangan), badan usaha,
              maupun badan hukum yang telah melakukan registrasi pada platform
              INDODAX, sehingga memperoleh otorisasi dari platform INDODAX untuk
              melakukan Syarat – Syarat dan Ketentuan Umum (selanjutnya disebut
              sebagai “SKU”) INDODAX adalah ketentuan yang berisikan syarat dan
              ketentuan mengenai penggunaan produk, jasa, teknologi, fitur
              layanan yang diberikan oleh INDODAX termasuk, namun tidak terbatas
              pada penggunaan Website, Dompet Bitcoin Indonesia dan INDODAX
              Trading Platform (Trading App) (untuk selanjutnya disebut sebagai
              “Platform INDODAX”) sepanjang tidak diatur secara khusus
              sebagaimana tercantum pada bagian registrasi Akun INDODAX yang
              dibuat pada hari dan tanggal yang tercantum dalam bagian
              registrasi Akun https://indodax.com, merupakan satu kesatuan tidak
              terpisahkan dan persetujuan atas SKU ini. Dengan mendaftar menjadi
              Member/Verified Member, Anda menyatakan telah MEMBACA, MEMAHAMI,
              MENYETUJUI dan MEMATUHI Persyaratan dan Ketentuan di bawah. Anda
              disarankan membaca semua persyaratan dan ketentuan secara seksama
              sebelum menggunakan layanan platform INDODAX atau segala layanan
              yang diberikan, dan bersama dengan ini Anda setuju dan mengikatkan
              diri terhadap seluruh kegiatan dalam SKU ini dengan persyaratan
              dan ketentuan sebagai berikut : DEFINISI sepanjang konteks
              kalimatnya tidak menentukan lain, istilah atau definisi dalam SKU
              memiliki arti sebagai berikut : Website mengacu pada situs online
              dengan alamat https://indodax.com. Website ini dikelola oleh
              INDODAX, dengan tidak terbatas pada para pemilik, investor,
              karyawan dan pihak-pihak yang terkait dengan INDODAX. Tergantung
              pada konteks, “Website” dapat juga mengacu pada jasa, produk,
              situs, konten atau layanan lain yang disediakan oleh INDODAX. Aset
              Kripto adalah komoditas digital yang menggunakan prinsip teknologi
              desentralisasi berbasiskan jaringan peer-to-peer (antar muka)atau
              disebut dengan Jaringan Blockchain yang diperdagangkan di dalam
              platform Blockchain adalah sebuah buku besar terdistribusi
              (distributed ledger) terbuka yang dapat mencatat transaksi antara
              dua pihak secara efisien dan dengan cara yang dapat diverifikasi
              secara permanen. Registrasi adalah proses pendaftaran menjadi
              Member dalam platform INDODAX yang merupakan proses verifikasi
              awal untuk memperoleh keterangan, pernyataan dalam penggunaan
              layanan platform Member adalah orang (perseorangan), badan usaha,
              maupun badan hukum yang telah melakukan registrasi pada platform
              INDODAX, sehingga memperoleh otorisasi dari platform INDODAX untuk
              melakukan SYARAT DAN KETENTUAN UMUM DAN RISIKO PERDAGANGAN
              MEMBER/VERIFIED MEMBER INDODAX.COM INI TELAH DISESUAIKAN DENGAN
              KETENTUAN PERATURAN PERUNDANG-UNDANGAN YANG BERLAKU.
            </small>
          </p>
        </IonContent>
        <IonItem>
          <IonLabel className="ion-text-wrap" {...{ for: "terms" }}>
            {termsMessage
              ? termsMessage
              : "I  agree all statements in terms of service"}
          </IonLabel>
          <IonCheckbox
            id="terms"
            className="agree"
            checked={hasConfirmed}
            onIonChange={clickCheckBox}
          ></IonCheckbox>
        </IonItem>
        <div className="ion-padding">
          <IonButton
            fill="clear"
            disabled={disableButtonTos}
            onClick={(e) => handleClick(e as any)}
            className="btn btn-primary"
          >
            Accept
          </IonButton>
        </div>
      </IonModal>
    </IonPage>
  );
};

export const SignUpForm = React.memo(SignUpFormComponent);
