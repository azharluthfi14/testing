import { History } from "history";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect, MapStateToProps } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { captchaType } from "../../api/config";
import { IntlProps } from "../../";
import { Captcha } from "../../components";
import { EMAIL_REGEX, setDocumentTitle } from "../../helpers";
import {
  emailVerificationFetch,
  GeetestCaptchaResponse,
  resetCaptchaState,
  RootState,
  selectCaptchaResponse,
  selectCurrentLanguage,
  selectGeetestCaptchaSuccess,
  selectMobileDeviceState,
  selectRecaptchaSuccess,
  selectSendEmailVerificationError,
  selectSendEmailVerificationLoading,
  selectSendEmailVerificationSuccess,
  selectUserInfo,
  User,
  createConfirmationCodeFetch,
  selectConfirmationCodeCreateSuccess,
} from "../../modules";
import { CommonError } from "../../modules/types";
import {
  IonHeader,
  IonPage,
  IonButton,
  IonIcon,
  IonSpinner,
  IonContent,
} from "@ionic/react";
import PinInput from "react-pin-input";
import { arrowBackOutline } from "ionicons/icons";

const second_button_disable = 60;

interface OwnProps {
  history: History;
  location: {
    state: {
      email: string;
    };
  };
  success: boolean;
  error?: CommonError;
}

interface DispatchProps {
  emailVerificationFetch: typeof emailVerificationFetch;
  resetCaptchaState: typeof resetCaptchaState;
  createConfirmationCodeFetch: typeof createConfirmationCodeFetch;
}

interface ReduxProps {
  emailVerificationLoading: boolean;
  isMobileDevice: boolean;
  captcha_response?: string | GeetestCaptchaResponse;
  reCaptchaSuccess: boolean;
  geetestCaptchaSuccess: boolean;
  user: User;
  ConfirmationCodeCreateSuccess: boolean;
}

interface VerificationState {
  countDownSecond: number;
  disabledButton: boolean;
  code: string;
}

type Props = DispatchProps & ReduxProps & OwnProps & IntlProps;

class EmailVerification extends React.Component<Props, VerificationState> {
  private timeID: NodeJS.Timeout;
  constructor(props: Props) {
    super(props);

    this.state = {
      countDownSecond: second_button_disable,
      disabledButton: true,
      code: "",
    };
  }

  public componentDidMount() {
    setDocumentTitle("Email verification");
    if (!this.props.location.state) {
      this.props.history.push("/login");
    }
    if (this.state.disabledButton) {
      this.timeID = setInterval(() => this.tick(), 1000);
    }
  }

  public componentWillUnmount() {
    clearInterval(this.timeID);
  }

  public componentDidUpdate(prevProps: Props) {
    const { history, ConfirmationCodeCreateSuccess } = this.props;
    if (ConfirmationCodeCreateSuccess === true) {
      history.push("/login");
    }
  }

  public translate = (id: string) => this.props.intl.formatMessage({ id });

  public renderCaptcha = () => {
    const { error, success } = this.props;

    return <Captcha error={error} success={success} />;
  };

  public tick() {
    this.setState({ countDownSecond: this.state.countDownSecond - 1 });
    if (this.state.countDownSecond <= 0) {
      this.setState({
        countDownSecond: second_button_disable,
        disabledButton: false,
      });
      clearInterval(this.timeID);
    }
  }

  public render() {
    const { emailVerificationLoading } = this.props;
    const button = this.props.intl.formatMessage({
      id: "page.resendConfirmation",
    });

    return (
      <IonPage>
        <IonHeader className="ion-padding">
          <div onClick={() => window.history.back()}>
            <IonIcon className="text-white" icon={arrowBackOutline} />
          </div>
        </IonHeader>
        <IonContent>
          <div id="appCapsule">
            <div className="login-form mt-1 p-2">
              <h4 className="fw-bold">Confirm Email address</h4>
              <p className="mb-2">
                We send an email to{" "}
                <span className="text-primary">
                  {this.props.location.state?.email}
                </span>
                , please check your inbox and find the confirmation code we've
                sent you
              </p>
              {emailVerificationLoading ? (
                <IonSpinner name="bubbles"></IonSpinner>
              ) : (
                <div className="text-end">
                  <button
                    className="btn btn-link text-warning text-decoration-underline"
                    onClick={this.handleClick}
                    disabled={this.disableButton() || this.state.disabledButton}
                  >
                    <small>
                      {button} &nbsp;
                      {this.state.disabledButton ? (
                        <span>( {this.state.countDownSecond} )</span>
                      ) : (
                        ""
                      )}
                    </small>
                  </button>
                </div>
              )}
              <div className="mt-5">
                <p className="text-secondary">
                  Enter the code we just sent you on your email address
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <PinInput
                    length={6}
                    secret
                    onChange={this.handleChangeConfirmChange}
                    onComplete={this.handleChangeConfirmChange}
                    type="numeric"
                    inputMode="number"
                    style={{ padding: "5px" }}
                    inputStyle={{ borderColor: "grey" }}
                    autoSelect={true}
                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                  />
                </div>
              </div>

              <div className="mt-4 mb-2">{this.renderCaptcha()}</div>

              <button
                onClick={() => this.codeConfirm(this.state.code)}
                className="btn btn-primary mt-4"
                color="primary"
                disabled={this.disableButton() || this.state.code.length < 6}
              >
                Activate
              </button>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  private codeConfirm = (value: string) => {
    this.setState({
      code: value,
    });
    const payload = {
      email: this.props.location.state.email,
      code: this.state.code,
    };
    this.props.createConfirmationCodeFetch(payload);
  };

  private handleChangeConfirmChange = (value: string) => {
    this.setState({
      code: value,
    });
  };

  private handleClick = (event) => {
    const { captcha_response } = this.props;
    event.preventDefault();
    switch (captchaType()) {
      case "recaptcha":
      case "geetest":
        this.props.emailVerificationFetch({
          email: this.props.location.state.email,
          captcha_response,
        });
        break;
      default:
        this.props.emailVerificationFetch({
          email: this.props.location.state.email,
        });
        break;
    }
    this.setState({
      disabledButton: true,
    });
    this.timeID = setInterval(() => this.tick(), 1000);
    this.props.resetCaptchaState();
  };

  private disableButton = (): boolean => {
    const { location, geetestCaptchaSuccess, reCaptchaSuccess } = this.props;
    const captchaTypeValue = captchaType();

    if (
      location.state &&
      location.state.email &&
      !location.state.email.match(EMAIL_REGEX)
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
  };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (
  state
) => ({
  emailVerificationLoading: selectSendEmailVerificationLoading(state),
  i18n: selectCurrentLanguage(state),
  isMobileDevice: selectMobileDeviceState(state),
  error: selectSendEmailVerificationError(state),
  success: selectSendEmailVerificationSuccess(state),
  captcha_response: selectCaptchaResponse(state),
  reCaptchaSuccess: selectRecaptchaSuccess(state),
  geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
  user: selectUserInfo(state),
  ConfirmationCodeCreateSuccess: selectConfirmationCodeCreateSuccess(state),
});

const mapDispatchToProps = {
  emailVerificationFetch,
  resetCaptchaState,
  createConfirmationCodeFetch,
};

export default compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(EmailVerification) as React.ComponentClass;
