import * as React from "react";
import { CodeVerification } from "../CodeVerification";
import { arrowBackOutline } from "ionicons/icons";
import {
  IonHeader,
  IonPage,
  IonIcon,
  IonText,
  IonButton,
  IonFooter,
  IonContent,
} from "@ionic/react";
import "./TwoFactorAuth.css";

export interface TwoFactorAuthProps {
  isMobile?: boolean;
  isLoading?: boolean;
  onSubmit: () => void;
  title: string;
  buttonLabel: string;
  message: string;
  otpCode: string;
  handleOtpCodeChange: (otp: string) => void;
  handleClose2fa: () => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  isMobile,
  isLoading,
  title,
  message,
  otpCode,
  buttonLabel,
  onSubmit,
  handleOtpCodeChange,
  handleClose2fa,
}) => {
  const handleEnterPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && otpCode.length >= 6) {
        event.preventDefault();
        onSubmit();
      }
    },
    [onSubmit, otpCode]
  );

  return (
    <IonPage>
      <IonHeader className="ion-padding">
        <div className=" text-left">
          <div className="btn-back" onClick={handleClose2fa}>
            <IonIcon className="text-white" icon={arrowBackOutline} />
          </div>
        </div>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mt-3">
          <h3 className="fw-bold text-capitalize">
            {title || "2FA verification"}
          </h3>
          <p className="text-secondary">
            Please Enter the confirmation code that you see on your
            authentication app
          </p>
          <div className="pt-3 pb-3">
            <CodeVerification
              code={otpCode}
              onChange={handleOtpCodeChange}
              onSubmit={handleEnterPress}
              codeLength={6}
              type="text"
              placeholder="*"
              inputMode="decimal"
              showPaste2FA={true}
              isMobile={isMobile}
            />
          </div>
          {/* <div className="text-end">
            <IonText className="fw-bold my-1" color="secondary">
              <small>Lost Two-Factor Authentication Code?</small>
            </IonText>
          </div> */}
        </div>
      </IonContent>
      <IonFooter className="ion-padding">
        <button
          disabled={isLoading || otpCode.length < 6}
          onClick={onSubmit}
          className="btn btn-primary"
        >
          {isLoading ? "Loading..." : buttonLabel ? buttonLabel : "Sign in"}
        </button>
      </IonFooter>
    </IonPage>
  );
};

export default TwoFactorAuth;
