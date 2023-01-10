import * as React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getLanguageName } from "../../helpers";
import {
  selectCurrentColorTheme,
  selectCurrentLanguage,
  selectUserInfo,
  selectUserLoggedIn,
  logoutFetch,
  getUserDelete,
  selectUserDeleteSuccess,
} from "../../modules";
import { ProfileLinks } from "../../components/Profile";
import { CustomInputIcon, CustomInput } from "../../components";
import { useHistory } from "react-router";
import "./profile.css";
import {
  IonHeader,
  IonPage,
  IonIcon,
  IonContent,
  IonInput,
  IonModal,
  IonToolbar,
  IonButtons,
  IonAvatar,
  IonTitle,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonText,
} from "@ionic/react";
import {
  arrowBackOutline,
  chevronForwardOutline,
  personCircleOutline,
} from "ionicons/icons";

const defaultProfile = { first_name: null, last_name: null };
const Profile: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const currentTheme = useSelector(selectCurrentColorTheme);
  const userLoggedIn = useSelector(selectUserLoggedIn);
  const history = useHistory();
  const [showDialog, setShowDialog] = React.useState(false);
  const [showDialogDelete, setShowDialogDelete] = React.useState(false);
  const [showpassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [passwordType, setPasswordType] = React.useState("password");
  const [iconInput, setIconInput] = React.useState("eye-outline");
  const isSuccess = useSelector(selectUserDeleteSuccess);

  const profiles = user.profiles || [];
  const profile = profiles[0] || defaultProfile;
  const first_name = profile.first_name;
  const last_name = profile.last_name;
  let name = user.email;

  if (first_name) name = first_name + " " + last_name;
  const handleLogoutUser = () => {
    dispatch(logoutFetch());
  };

  const mainLinks = [
    {
      titleKey: "page.mobile.profileLinks.main.verification",
      route: "/user/profile/verification",
      children: (
        <div className="separate">
          <span className="green">
            {intl.formatMessage(
              { id: "page.mobile.profileLinks.link.verification" },
              { level: user.level }
            )}
          </span>
          <IonIcon icon={chevronForwardOutline} className="icon-forward" />
        </div>
      ),
    },
    {
      titleKey: "page.body.internal.transfer.header",
      route: "/user/internal-transfers",
      children: (
        <div className="separate">
          <IonIcon icon={chevronForwardOutline} className="icon-forward" />
        </div>
      ),
    },
    {
      titleKey: "page.mobile.profileLinks.main.2fa",
      route: "/user/profile/2fa",
      state: {
        enable2fa: !user.otp,
      },
      children: (
        <div className="separate">
          {user.otp ? (
            <span className="color-green">
              {intl.formatMessage({
                id: "page.mobile.profileLinks.link.2fa.enabled",
              })}
            </span>
          ) : (
            <span className="color-red">
              {intl.formatMessage({
                id: "page.mobile.profileLinks.link.2fa.disabled",
              })}
            </span>
          )}
          <IonIcon icon={chevronForwardOutline} className="icon-forward" />
        </div>
      ),
    },
    {
      titleKey: "page.mobile.profileLinks.main.changePassword",
      route: "/user/profile/change-password",
    },
    {
      titleKey: "page.mobile.profileLinks.main.activity",
      route: "/user/profile/account-activity",
    },
    {
      titleKey: "page.mobile.profileLinks.main.apiKeys",
      route: "/user/profile/api-keys",
    },
  ];

  const settingsLinks = [
    {
      titleKey: "page.mobile.profileLinks.settings.language",
      route: "/user/profile/language",
      children: (
        <div className="separate">
          <span>{getLanguageName(currentLanguage)}</span>
          <IonIcon icon={chevronForwardOutline} className="icon-forward" />
        </div>
      ),
    },
    {
      titleKey: "page.mobile.profileLinks.settings.theme",
      route: "/user/profile/theme",
      children: (
        <div className="separate">
          <span className="text-capitalize">{currentTheme}</span>
          <IonIcon icon={chevronForwardOutline} className="icon-forward" />
        </div>
      ),
    },
  ];

  const additionalLinks = [
    {
      titleKey: "page.mobile.profileLinks.additional.referral",
      route: "/user/referral",
      children: (
        <div className="separate">
          <IonIcon icon={chevronForwardOutline} className="icon-forward" />
        </div>
      ),
    },
  ];

  const clearForm = () => {
    setPassword("");
    setOtpCode("");
  };

  const handleConfirmDelete = () => {
    setShowDialogDelete(false);
    setShowPassword(true);
  };

  const handleChangeValue = (e) => {
    setPassword(e);
  };
  const handleChangeValueOTP = (e) => {
    setOtpCode(e);
  };
  const handleKeyPassword = () => {};

  const handleDeleteAccount = () => {
    dispatch(getUserDelete({ password: password, otp_code: otpCode }));
    setShowPassword(false);
    clearForm();
  };

  const handleIconClick = React.useCallback(() => {
    iconInput === "eye-outline"
      ? setIconInput("eye-off-outline")
      : setIconInput("eye-outline");
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  }, [iconInput, passwordType]);

  const closeDialog = () => {
    setShowPassword(false);
    clearForm();
  };

  return (
    <IonPage>
      <IonHeader className="dark-bg-main">
        <div className="ion-padding">
          <div className="d-flex justify-center align-item-center gap-2">
            <IonAvatar>
              <img src="assets/images/avatar.png" alt="avatar" className="" />
            </IonAvatar>
            <div>
              <h6 className="mb-0 fw-bold  text-gradient">Hi, {name}</h6>
              <p className="m-0 text-secondary">
                <small>
                  UID:
                  {user.uid} ~ {user.username ? user.username : ""}
                </small>
              </p>
            </div>
          </div>
        </div>
        {/* <div className="pl-2 pr-2">
          {user.level < 3 ? (
            <div
              className="banner-referral bg-warning"
              onClick={() => history.push("/user/profile/verification")}
            >
              <div className="separate">
                <div className="separate-start">
                  <div className="mr-2">
                    <img
                      src="/assets/images/kyc.png"
                      alt="referral"
                      className="img-round"
                    />
                  </div>
                  <div>
                    <div className="banner-referral__title">
                      Confirm Account
                    </div>
                    <div className="banner-referral__subtitle">
                      In order to start using koinku account, you need to
                      confirm your identity.
                    </div>
                  </div>
                </div>
                <div className="wd-40p banner-referral__icon">
                  <IonIcon icon={chevronForwardOutline} />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="banner-referral"
              onClick={() => history.push("/user/referral")}
            >
              <div className="separate">
                <div className="separate-start">
                  <div className="mr-2">
                    <img
                      src="/assets/images/icon-referral.png"
                      alt="referral"
                      className="img-round"
                    />
                  </div>
                  <div>
                    <div className="banner-referral__title">Invite Friends</div>
                    <div className="banner-referral__subtitle">
                      Invite your friends and get commission from each
                      transactions.
                    </div>
                  </div>
                </div>
                <div className="wd-40p banner-referral__icon">
                  <IonIcon icon={chevronForwardOutline} />
                </div>
              </div>
            </div>
          )}
        </div> */}
      </IonHeader>
      <IonContent>
        <div className="mt-2 pl-2 pr-2">
          <div className="profil-divider">General</div>
          <ProfileLinks links={mainLinks} />
          <div className="profil-divider">Settings</div>
          <ProfileLinks links={settingsLinks} />
          <div className="profil-divider">Referral</div>
          <ProfileLinks links={additionalLinks} />
          <div
            className="pg-mobile-profile-links"
            onClick={() => setShowDialogDelete(true)}
          >
            <div className="pg-mobile-profile-links__item">
              <span className="pg-mobile-profile-links__item__left warning">
                Request Delete account
              </span>
              <div className="pg-mobile-profile-links__item__right">
                <div className="separate">
                  <IonIcon
                    icon={chevronForwardOutline}
                    className="icon-forward"
                  />
                </div>
              </div>
            </div>
          </div>
          {userLoggedIn && (
            <div
              className="pg-mobile-profile-links"
              onClick={() => setShowDialog(true)}
            >
              <div className="pg-mobile-profile-links__item">
                <span className="pg-mobile-profile-links__item__left red">
                  Logout
                </span>
                <div className="pg-mobile-profile-links__item__right">
                  <div className="separate">
                    <IonIcon
                      icon={chevronForwardOutline}
                      className="icon-forward"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonContent>
      {showpassword && (
        <div className="modal fade dialogbox show" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content pt-0">
              <div className="modal-body mb-0">
                <div className="text-large bold">Request to delete account</div>
                <div className="pt-2">
                  <CustomInputIcon
                    type={passwordType}
                    label="Your password"
                    placeholder="****************"
                    defaultLabel="Password"
                    handleChangeInput={handleChangeValue}
                    inputValue={password}
                    autoFocus={false}
                    handleIconClick={handleIconClick}
                    onKeyPress={handleKeyPassword}
                    icon={iconInput}
                  />
                </div>
                {user.otp && (
                  <div className="pt-2">
                    <CustomInput
                      type={"text"}
                      label="6 Digit 2FA Code"
                      placeholder="******"
                      defaultLabel="OTP COde"
                      handleChangeInput={handleChangeValueOTP}
                      inputValue={otpCode}
                      autoFocus={false}
                      onKeyPress={handleKeyPassword}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <div className="btn-inline">
                  <div
                    className="btn btn-text-secondary"
                    onClick={() => closeDialog()}
                  >
                    NO
                  </div>
                  <div
                    className="btn btn-text-danger"
                    onClick={() => handleDeleteAccount()}
                  >
                    YES
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDialogDelete && (
        <div className="modal fade dialogbox show" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content pt-0">
              <div className="modal-body mb-0">
                <div className="text-large bold">Request to delete account</div>
                <div className="pt-2 pb-2">
                  Are you sure to delete your naga exchange account
                </div>
              </div>
              <div className="modal-footer">
                <div className="btn-inline">
                  <div
                    className="btn btn-text-secondary"
                    onClick={() => setShowDialogDelete(false)}
                  >
                    NO
                  </div>
                  <div
                    className="btn btn-text-danger"
                    onClick={() => handleConfirmDelete()}
                  >
                    SURE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDialog && (
        <div className="modal fade dialogbox show" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content pt-0">
              <div className="modal-body mb-0">
                <div className="pt-2 pb-2">Are you sure want to logout</div>
              </div>
              <div className="modal-footer">
                <div className="btn-inline">
                  <div
                    className="btn btn-text-secondary"
                    onClick={() => setShowDialog(false)}
                  >
                    CLOSE
                  </div>
                  <div
                    className="btn btn-text-danger"
                    onClick={() => handleLogoutUser()}
                  >
                    SURE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default Profile;
