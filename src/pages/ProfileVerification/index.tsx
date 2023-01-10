import * as React from "react";
import { useHistory } from "react-router";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { ProfileVerificationMobile } from "../../containers/ProfileVerification";

const ProfileVerification: React.FC = () => {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/user/confirm`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons
            slot="start"
            onClick={() => history.push("/user/profile")}
          >
            <IonIcon
              slot="icon-only"
              icon={arrowBackOutline}
              className="ml-1"
            ></IonIcon>
          </IonButtons>
          <IonTitle className="ion-text-center title-wallet text-large bold">
            Select Language
          </IonTitle>
          <IonButtons slot="end"></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-body">
        <div className="content mt-2">
          <div className="section mt-2 text-main p-2 pb-0">
            <h2>Let’s verify your identity</h2>
            <h4>Choose your document to verify your identity</h4>
          </div>
          <div className="modal-body t5 t-light p-2 pt-0">
            <ProfileVerificationMobile handleClick={() => handleClick()} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileVerification;
