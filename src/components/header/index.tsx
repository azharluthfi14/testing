import * as React from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useMarketsFetch } from "../../hooks";
import "./header.css";

import {
  selectMarkets,
  selectCurrencies,
  setCurrentMarket,
  selectUserLoggedIn,
  Market,
} from "../../modules";

import {
  IonContent,
  IonSpinner,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonMenu,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import {
  personCircleOutline,
  searchOutline,
  closeCircle,
  scanOutline,
} from "ionicons/icons";
import { LogoIcon } from "../../assets/images/LogoIcon";

const noHeaderRoutes = ["/markets"];

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchKey, setSearchKey] = React.useState("");
  const shouldRenderHeader = !noHeaderRoutes.some((r) =>
    window.location.pathname.includes(r)
  );
  const history = useHistory();
  const markets = useSelector(selectMarkets);
  const currencies = useSelector(selectCurrencies);
  const isLoggedIn = useSelector(selectUserLoggedIn);
  const dispatch = useDispatch();
  useMarketsFetch();

  const formatedMarkets = markets.map((market) => ({
    ...market,
    baseCurrency: currencies.find((obj) => obj.id === market.base_unit),
  }));
  var listMarket = formatedMarkets.filter(
    (obj) =>
      obj.id.toLowerCase().includes(searchKey.toLowerCase()) ||
      obj.baseCurrency.name.toLowerCase().includes(searchKey.toLowerCase())
  );
  var listCurrency =
    currencies &&
    currencies.filter(
      (obj) =>
        obj.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        obj.id.toLowerCase().includes(searchKey.toLowerCase())
    );

  const closeSearchForm = () => {
    setShowSearch(false);
    setSearchKey("");
  };

  if (!shouldRenderHeader) {
    return <React.Fragment />;
  }

  const handleRedirectToTrading = (id: string) => {
    const currentMarket: Market | undefined = markets.find(
      (item) => item.id === id
    );
    if (currentMarket) {
      dispatch(setCurrentMarket(currentMarket));
      history.push(`/trading/${id}`);
    }
  };

  return (
    <React.Fragment>
      <div className="naga-mobile-header">
        <div>
          <LogoIcon className="" />
        </div>
        <div className="header-item">
          <div className="icon-header" onClick={() => setShowSearch(true)}>
            <IonIcon size="small" className="text-white" icon={searchOutline} />
          </div>
          <div
            className="icon-header"
            onClick={() => history.push("/user/profile")}
          >
            <IonIcon
              size="small"
              className="text-white"
              icon={personCircleOutline}
            />
          </div>
        </div>
      </div>

      <div
        id="search"
        className={`appHeader border-none ${showSearch ? "show" : ""}`}
      >
        <form className="search-form">
          <div className="form-group searchbox">
            <input
              type="text"
              className="form-control"
              placeholder="Search market or Currency"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <i className="input-icon">
              <IonIcon icon={searchOutline} />
            </i>
            <div
              className="ml-1 close toggle-searchbox"
              onClick={() => closeSearchForm()}
            >
              <IonIcon icon={closeCircle} />
            </div>
          </div>
        </form>
        {searchKey !== "" && (
          <div className="border-top pe-3 ps-3">
            <div className="section-title mt-1 text-white">Markets</div>
            <div className="mb-1">
              {!listMarket.length && (
                <div className="text-white text-capitalize">
                  no market available
                </div>
              )}
              {listMarket.length > 0 &&
                listMarket.map((list) => (
                  <div
                    className="separate"
                    key={list.id}
                    style={{ height: "28px" }}
                    onClick={() => handleRedirectToTrading(list.id)}
                  >
                    <div className="text-secondary">
                      {list.baseCurrency.name}
                    </div>
                    <div className="text-uppercase text-white pl-1 pr-1">
                      {list.name}
                    </div>
                  </div>
                ))}
            </div>
            {isLoggedIn && (
              <React.Fragment>
                <div className="section-title text-white">Currency</div>
                <div className="mb-3">
                  {!listCurrency.length && (
                    <div className="text-white text-capitalize">
                      no currency available
                    </div>
                  )}
                  {listCurrency.length > 0 &&
                    listCurrency.map((list) => (
                      <span
                        className="text-white pl-1 pr-1 mr-1"
                        style={{
                          borderRadius: "5px",
                          paddingTop: "3px",
                          paddingBottom: "3px",
                        }}
                        onClick={() => history.push(`/wallets/${list.id}`)}
                      >
                        {list.name}
                      </span>
                    ))}
                </div>
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Header;
