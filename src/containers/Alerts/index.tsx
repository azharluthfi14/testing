import * as React from "react";
import { injectIntl } from "react-intl";
import { connect, MapDispatchToPropsFunction } from "react-redux";
import { IntlProps } from "../../";
import {
  alertDelete,
  alertDeleteByIndex,
  AlertState,
  RootState,
  selectAlertState,
} from "../../modules";
import { IonButton, IonContent, IonFooter } from "@ionic/react";

import "./alert.css";

interface ReduxProps {
  alerts: AlertState;
}

interface DispatchProps {
  alertDelete: typeof alertDelete;
  alertDeleteByIndex: typeof alertDeleteByIndex;
}

type Props = ReduxProps & DispatchProps & IntlProps;

class Alerts extends React.Component<Props> {
  public deleteAlertByIndex = (key: number) => {
    this.props.alertDeleteByIndex(key);
  };

  public translate = (id: string) => {
    return id ? this.props.intl.formatMessage({ id }) : "";
  };

  public render() {
    return (
      <div className="pg-alerts">
        {this.props.alerts.alerts.map((w) =>
          w.message.map((msg, index) => (
            <div
              key={index}
              onClick={() => this.deleteAlertByIndex(index)}
              className={`toast-box toast-bottom alert-content text-white show ${
                w.type === "error" ? "bg-danger" : "bg-success"
              }`}
            >
              <div className="in">
                <div className="text">{this.translate(msg)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
  alerts: selectAlertState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (
  dispatch
) => ({
  alertDelete: () => dispatch(alertDelete()),
  alertDeleteByIndex: (payload) => dispatch(alertDeleteByIndex(payload)),
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Alerts)
) as React.FunctionComponent;
