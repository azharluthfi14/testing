import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { selectBeneficiaries, Beneficiary } from "../../../modules";
import { IonIcon, IonPage } from "@ionic/react";
import { trashOutline } from "ionicons/icons";

interface SelectBeneficiariesCryptoProps {
  blockchainKey: string;
  currency: string;
  handleClickSelectAddress: (item: Beneficiary) => () => void;
  handleDeleteAddress: (item: Beneficiary) => () => void;
}

export const SelectBeneficiariesCrypto: React.FunctionComponent<
  SelectBeneficiariesCryptoProps
> = (props: SelectBeneficiariesCryptoProps) => {
  const { currency, blockchainKey } = props;
  const { formatMessage } = useIntl();
  const beneficiaries: Beneficiary[] = useSelector(selectBeneficiaries);
  const filteredBeneficiaries = beneficiaries.filter((obj) =>
    obj.currency.toLowerCase().includes(currency.toLowerCase())
  );

  const renderBeneficiaryItem = React.useCallback(
    (item, index) => {
      const isPending = item.state && item.state.toLowerCase() === "pending";
      if (item.blockchain_key === blockchainKey) {
        return (
          <IonPage>
            <div className="separate beneficiaries-row" key={index}>
              {item.blockchain_key && (
                <div
                  onClick={props.handleClickSelectAddress(item)}
                  className="wd-100"
                >
                  <div>{item.name}</div>
                  <div className="ben-address">{item.data?.address}</div>
                </div>
              )}
              {!item.blockchain_key && (
                <div
                  onClick={props.handleClickSelectAddress(item)}
                  className="wd-100"
                >
                  <div>{item.data?.bank_name.split("[")[0]}</div>
                  <div>{item.data?.account_number}</div>
                  <div className="ben-address">{item.data?.full_name}</div>
                </div>
              )}
              <div
                className="text-danger ml-1 mr-1"
                onClick={props.handleDeleteAddress(item)}
              >
                <IonIcon icon={trashOutline} className="trash-icon" />
              </div>
              {isPending && (
                <div
                  className="btn-small btn-warning btn-select"
                  onClick={props.handleClickSelectAddress(item)}
                >
                  Confirm
                </div>
              )}
              {!isPending && (
                <div
                  className="btn-small btn-success btn-select"
                  onClick={props.handleClickSelectAddress(item)}
                >
                  Select
                </div>
              )}
            </div>
          </IonPage>
        );
      }

      return null;
    },
    [beneficiaries]
  );

  return (
    <div className="mt-2" key={blockchainKey}>
      {filteredBeneficiaries.map(renderBeneficiaryItem)}
    </div>
  );
};
