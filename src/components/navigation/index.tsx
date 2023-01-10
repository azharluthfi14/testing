import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Redirect, Route } from "react-router";
import {
  homeOutline,
  podiumOutline,
  swapHorizontalOutline,
  walletOutline,
  personOutline,
} from "ionicons/icons";

import Landing from "../../pages/landing";
import Wallet from "../../pages/wallets";
import Markets from "../../pages/markets";
import ProtectedRoute from "../../global/ProtectedRoute";
import Order from "../../pages/orders";
import Profile from "../../pages/profile";
import Activity from "../../pages/Activity";
import profilLanguage from "../../pages/profilLanguage";
import ProfileTheme from "../../pages/profileThemes";
import ProfileApiKeys from "../../pages/ProfileApiKeys";
import ProfileChangePassword from "../../pages/ProfileChangePassword";
import ReferralScreen from "../../pages/ReferralScreen";
import InternalTransfer from "../../components/InternalTransfer";

const Navigation = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/user/home" component={Landing} />
        <Route exact path="/user/markets" component={Markets} />
        <ProtectedRoute exact path="/user/wallets" component={Wallet} />
        <ProtectedRoute exact path="/user/orders" component={Order} />
        <ProtectedRoute
          exact
          path="/user/profile/account-activity"
          component={Activity}
        />
        <ProtectedRoute
          exact
          path="/user/profile/language"
          component={profilLanguage}
        />
        <ProtectedRoute
          exact
          path="/user/profile/theme"
          component={ProfileTheme}
        />
        <ProtectedRoute
          exact
          path="/user/profile/api-keys"
          component={ProfileApiKeys}
        />
        <ProtectedRoute
          exact
          path="/user/profile/change-password"
          component={ProfileChangePassword}
        />
        <ProtectedRoute
          exact
          path="/user/internal-transfers"
          component={InternalTransfer}
        />
        <ProtectedRoute
          exact
          path="/user/referral"
          component={ReferralScreen}
        />
        <ProtectedRoute exact path="/user/profile" component={Profile} />
        <Redirect exact from="/user" to="/user/home" />
        <Redirect exact from="/" to="/user/home" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="border-none">
        <IonTabButton tab="home" href="/user/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="markets" href="/user/markets">
          <IonIcon icon={podiumOutline} />
          <IonLabel>Markets</IonLabel>
        </IonTabButton>
        <IonTabButton tab="orders" href="/user/orders">
          <IonIcon icon={swapHorizontalOutline} />
          <IonLabel>Orders</IonLabel>
        </IonTabButton>
        <IonTabButton tab="wallets" href="/user/wallets">
          <IonIcon icon={walletOutline} />
          <IonLabel>Wallets</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/user/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Navigation;
