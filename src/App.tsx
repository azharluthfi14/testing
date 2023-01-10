import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { IonApp, setupIonicReact, IonPage, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useRangerConnectFetch } from "./hooks";
import { useSelector, useDispatch } from "react-redux";
import {
  configsFetch,
  selectCurrentLanguage,
  userFetch,
  selectUserLoggedIn,
} from "./modules";
import { languageMap } from "./translations";
import * as mobileTranslations from "./mobile/translations";
import WalletsFetch from "./containers/WalletsFetch";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import ProtectedRoute from "./global/ProtectedRoute";

/* Theme variables */
import "./theme/variables.css";

import Alert from "./containers/Alerts";
import Login from "./pages/login";
import Register from "./pages/register";
import Forgot from "./pages/forgot";
import Reset from "./pages/reset";
import EmailVerification from "./pages/emailverification";
import navigation from "./components/navigation";
import Trading from "./pages/trading";
import WalletDetails from "./pages/walletDetails";
import WalletDeposit from "./pages/WalletDeposit";
import WalletWithdraw from "./pages/WalletWithdraw";
import ProfileAuth from "./pages/ProfileAuth";
import ProfileVerification from "./pages/ProfileVerification";
import ConfirmScreen from "./pages/ConfirmScreen";

import "./style/global.css";
//import "./style/exchange.css";

setupIonicReact();

const getTranslations = (lang: string) => {
  return {
    ...languageMap[lang],
    ...mobileTranslations[lang],
  };
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const lang = useSelector(selectCurrentLanguage);
  const loggedIn = useSelector(selectUserLoggedIn);

  React.useEffect(() => {
    dispatch(configsFetch());
    const token = localStorage.getItem("csrfToken");
    if (token) {
      dispatch(userFetch());
    }
  }, []);
  useRangerConnectFetch();

  return (
    <IntlProvider locale={lang} messages={getTranslations(lang)} key={lang}>
      <IonApp className="myApp">
        <Alert />
        <IonReactRouter>
          <IonPage id="main">
            <Switch>
              <Route path="/login" component={Login} exact={true} />
              <Route path="/register" component={Register} exact={true} />
              <Route path="/forgot_password" component={Forgot} exact={true} />
              <Route
                path="/email-verification"
                component={EmailVerification}
                exact={true}
              />
              <Route
                path="/accounts/password_reset"
                component={Reset}
                exact={true}
              />
              <Route
                path="/user/trading/:market?"
                component={Trading}
                exact={true}
              />
              <ProtectedRoute
                exact
                path="/user/profile/2fa"
                component={ProfileAuth}
              />
              <ProtectedRoute
                exact
                path="/user/wallets/:currency/deposit"
                component={WalletDeposit}
              />
              <ProtectedRoute
                exact
                path="/user/wallets/:currency/withdraw"
                component={WalletWithdraw}
              />
              <ProtectedRoute
                exact
                path="/user/wallets/:currency"
                component={WalletDetails}
              />
              <ProtectedRoute
                exact
                path="/user/profile/verification"
                component={ProfileVerification}
              />
              <ProtectedRoute
                exact
                path="/user/confirm"
                component={ConfirmScreen}
              />
              <Route path="/" component={navigation} />
              <Route path="/*" render={() => <Redirect to="/login" />} />
            </Switch>
            {loggedIn && <WalletsFetch />}
          </IonPage>
        </IonReactRouter>
      </IonApp>
    </IntlProvider>
  );
};
export default App;
