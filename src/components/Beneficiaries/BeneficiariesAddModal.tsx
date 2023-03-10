import classnames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { validateBeneficiaryAddress } from "../../helpers/validateBeneficiaryAddress";
import {
  beneficiariesCreate,
  BeneficiaryBank,
  selectCurrencies,
  selectMobileDeviceState,
  BlockchainCurrencies,
  selectUserInfo,
  selectBeneficiaries,
  Beneficiary,
} from "../../modules";
import { CustomInput, CustomInputScan } from "../";
import { Capacitor } from "@capacitor/core";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { bankList } from "../../helpers/bankList";
import { IonList, IonItem, IonSelect, IonSelectOption } from "@ionic/react";

import { IonIcon, IonButton, IonSpinner } from "@ionic/react";

interface Props {
  currency: string;
  type: "fiat" | "coin";
  handleToggleAddAddressModal: () => void;
}

const defaultSelected = {
  blockchainKey: "",
  protocol: "",
  name: "",
  id: "",
  fee: "",
  minWithdraw: "",
};

const BeneficiariesAddModalComponent: React.FC<Props> = (props: Props) => {
  const [coinAddress, setCoinAddress] = React.useState("");
  const [coinAddressValid, setCoinAddressValid] = React.useState(false);
  const [coinBlockchainName, setCoinBlockchainName] =
    React.useState(defaultSelected);
  const [coinBeneficiaryName, setCoinBeneficiaryName] = React.useState("");
  const [coinDescription, setCoinDescription] = React.useState("");
  const [coinDestinationTag, setCoinDestinationTag] = React.useState("");
  const [coinAddressFocused, setCoinAddressFocused] = React.useState(false);
  const [coinBeneficiaryNameFocused, setCoinBeneficiaryNameFocused] =
    React.useState(false);
  const [coinDescriptionFocused, setCoinDescriptionFocused] =
    React.useState(false);
  const [coinDestinationTagFocused, setCoinDestinationTagFocused] =
    React.useState(false);

  const [fiatName, setFiatName] = React.useState("");
  const [fiatFullName, setFiatFullName] = React.useState("");
  const [fiatAccountNumber, setFiatAccountNumber] = React.useState("");
  const [fiatBankName, setFiatBankName] = React.useState("");
  const [fiatBankSwiftCode, setFiatBankSwiftCode] = React.useState("");
  const [fiatIntermediaryBankName, setFiatIntermediaryBankName] =
    React.useState("");
  const [fiatIntermediaryBankSwiftCode, setFiatIntermediaryBankSwiftCode] =
    React.useState("");
  const [fiatNameFocused, setFiatNameFocused] = React.useState(false);
  const [fiatFullNameFocused, setFiatFullNameFocused] = React.useState(false);
  const [fiatAccountNumberFocused, setFiatAccountNumberFocused] =
    React.useState(false);
  const [fiatBankNameFocused, setFiatBankNameFocused] = React.useState(false);
  const [fiatBankSwiftCodeFocused, setFiatBankSwiftCodeFocused] =
    React.useState(false);
  const [fiatIntermediaryBankNameFocused, setFiatIntermediaryBankNameFocused] =
    React.useState(false);
  const [
    fiatIntermediaryBankSwiftCodeFocused,
    setFiatIntermediaryBankSwiftCodeFocused,
  ] = React.useState(false);
  const [apptype, setApptype] = React.useState("-");
  const beneficiaries: Beneficiary[] = useSelector(selectBeneficiaries);

  const { type, handleToggleAddAddressModal, currency } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const isMobileDevice = useSelector(selectMobileDeviceState);
  const currencies = useSelector(selectCurrencies);
  const currencyItem = currencies.find((item) => item.id === currency);
  const isRipple = React.useMemo(() => currency === "xrp", [currency]);

  const user = useSelector(selectUserInfo);
  const profiles = user.profiles;
  let name = "";
  if (profiles.length > 0) {
    const profile = profiles[0];
    name = profile.first_name + " " + profile.last_name;
  }

  if (fiatFullName === "") {
    setFiatFullName(name);
  }

  const handleClearModalsInputs = React.useCallback(() => {
    setCoinAddress("");
    setCoinBeneficiaryName("");
    setCoinBlockchainName(defaultSelected);
    setCoinDescription("");
    setCoinDestinationTag("");
    setCoinAddressFocused(false);
    setCoinBeneficiaryNameFocused(false);
    setCoinDescriptionFocused(false);
    setCoinDestinationTagFocused(false);
    setCoinAddressValid(false);

    setFiatAccountNumber("");
    setFiatName("");
    setFiatFullName("");
    setFiatBankName("");
    setFiatBankSwiftCode("");
    setFiatIntermediaryBankName("");
    setFiatIntermediaryBankSwiftCode("");
    setFiatNameFocused(false);
    setFiatFullNameFocused(false);
    setFiatAccountNumberFocused(false);
    setFiatBankNameFocused(false);
    setFiatBankSwiftCodeFocused(false);
    setFiatIntermediaryBankNameFocused(false);
    setFiatIntermediaryBankSwiftCodeFocused(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitAddAddressCoinModal = React.useCallback(() => {
    const payload = {
      currency: currency || "",
      name: coinBeneficiaryName,
      blockchain_key: coinBlockchainName.blockchainKey,
      data: JSON.stringify({
        address:
          isRipple && coinDestinationTag
            ? `${coinAddress}?dt=${coinDestinationTag}`
            : coinAddress,
      }),
      ...(coinDescription && { description: coinDescription }),
    };

    dispatch(beneficiariesCreate(payload));
    handleClearModalsInputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    coinAddress,
    coinBeneficiaryName,
    coinDescription,
    currency,
    coinBlockchainName,
  ]);

  const getState = React.useCallback(
    (key) => {
      switch (key) {
        case "coinAddress":
          return coinAddress;
        case "coinBeneficiaryName":
          return coinBeneficiaryName;
        case "coinDestinationTag":
          return coinDestinationTag;
        case "coinDescription":
          return coinDescription;
        case "coinAddressFocused":
          return coinAddressFocused;
        case "coinBeneficiaryNameFocused":
          return coinBeneficiaryNameFocused;
        case "coinDescriptionFocused":
          return coinDescriptionFocused;
        case "coinDestinationTagFocused":
          return coinDestinationTagFocused;
        case "fiatName":
          return fiatName;
        case "fiatFullName":
          return fiatFullName;
        case "fiatAccountNumber":
          return fiatAccountNumber;
        case "fiatBankName":
          return fiatBankName;
        case "fiatBankSwiftCode":
          return fiatBankSwiftCode;
        case "fiatIntermediaryBankName":
          return fiatIntermediaryBankName;
        case "fiatIntermediaryBankSwiftCode":
          return fiatIntermediaryBankSwiftCode;
        case "fiatNameFocused":
          return fiatNameFocused;
        case "fiatFullNameFocused":
          return fiatFullNameFocused;
        case "fiatAccountNumberFocused":
          return fiatAccountNumberFocused;
        case "fiatBankNameFocused":
          return fiatBankNameFocused;
        case "fiatBankSwiftCodeFocused":
          return fiatBankSwiftCodeFocused;
        case "fiatIntermediaryBankNameFocused":
          return fiatIntermediaryBankNameFocused;
        case "fiatIntermediaryBankSwiftCodeFocused":
          return fiatIntermediaryBankSwiftCodeFocused;
        default:
          return "";
      }
    },
    [
      coinAddress,
      coinAddressFocused,
      coinBeneficiaryName,
      coinBeneficiaryNameFocused,
      coinDescription,
      coinDescriptionFocused,
      coinDestinationTag,
      coinDestinationTagFocused,
      fiatAccountNumber,
      fiatAccountNumberFocused,
      fiatBankName,
      fiatBankNameFocused,
      fiatBankSwiftCode,
      fiatBankSwiftCodeFocused,
      fiatFullName,
      fiatFullNameFocused,
      fiatIntermediaryBankName,
      fiatIntermediaryBankNameFocused,
      fiatIntermediaryBankSwiftCode,
      fiatIntermediaryBankSwiftCodeFocused,
      fiatName,
      fiatNameFocused,
    ]
  );

  const validateCoinAddressFormat = React.useCallback(
    (value: string) => {
      const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency(
        currency,
        true
      );

      setCoinAddressValid(coinAddressValidator.test(value.trim()));
    },
    [currency]
  );

  const handleChangeFieldValue = React.useCallback(
    (key: string, value: string) => {
      switch (key) {
        case "coinAddress":
          setCoinAddress(value);
          validateCoinAddressFormat(value);
          break;
        case "coinBeneficiaryName":
          setCoinBeneficiaryName(value);
          break;
        case "coinDescription":
          setCoinDescription(value);
          break;
        case "coinDestinationTag":
          setCoinDestinationTag(value);
          break;
        case "fiatName":
          setFiatName(value);
          break;
        case "fiatFullName":
          setFiatFullName(value);
          break;
        case "fiatAccountNumber":
          const re = /^[0-9\b]+$/;
          if (re.test(value)) {
            setFiatAccountNumber(value);
          }
          break;
        case "fiatBankName":
          setFiatBankName(value);
          break;
        case "fiatBankSwiftCode":
          setFiatBankSwiftCode(value);
          break;
        case "fiatIntermediaryBankName":
          setFiatIntermediaryBankName(value);
          break;
        case "fiatIntermediaryBankSwiftCode":
          setFiatIntermediaryBankSwiftCode(value);
          break;
        default:
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const handleChangeFieldFocus = React.useCallback((key: string) => {
    switch (key) {
      case "coinAddressFocused":
        setCoinAddressFocused((v) => !v);
        break;
      case "coinBeneficiaryNameFocused":
        setCoinBeneficiaryNameFocused((v) => !v);
        break;
      case "coinDescriptionFocused":
        setCoinDescriptionFocused((v) => !v);
        break;
      case "coinDestinationTagFocused":
        setCoinDestinationTagFocused((v) => !v);
        break;
      case "fiatNameFocused":
        setFiatNameFocused((v) => !v);
        break;
      case "fiatFullNameFocused":
        setFiatFullNameFocused((v) => !v);
        break;
      case "fiatAccountNumberFocused":
        setFiatAccountNumberFocused((v) => !v);
        break;
      case "fiatBankNameFocused":
        setFiatBankNameFocused((v) => !v);
        break;
      case "fiatBankSwiftCodeFocused":
        setFiatBankSwiftCodeFocused((v) => !v);
        break;
      case "fiatIntermediaryBankNameFocused":
        setFiatIntermediaryBankNameFocused((v) => !v);
        break;
      case "fiatIntermediaryBankSwiftCodeFocused":
        setFiatIntermediaryBankSwiftCodeFocused((v) => !v);
        break;
      default:
        break;
    }
  }, []);

  const handleIconClick = async () => {
    const platform = Capacitor.getPlatform();
    await BarcodeScanner.checkPermission({ force: true });
    document.querySelector("body").classList.add("scanner-active");
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status) {
      await BarcodeScanner.hideBackground(); // make background of WebView transparent
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        handleChangeFieldValue("coinAddress", result.content);
      }
      await BarcodeScanner.stopScan();
      await BarcodeScanner.showBackground();
      document.querySelector("body").classList.remove("scanner-active");
    }
  };

  const renderAddAddressModalBodyItem = React.useCallback(
    (field: string, optional?: boolean) => {
      const focusedClass = classnames("cr-email-form__group", {
        "cr-email-form__group--focused": getState(`${field}Focused`),
        "cr-email-form__group--optional": optional,
      });

      if (field === "fiatBankName") {
        const options = bankList().map(({ label, value }) => ({
          value: label + "[" + value + "]",
          label: label,
        }));
        return (
          <div className="mb-5">
            <div className="field__label">Bank Name</div>
            <IonList>
              <IonItem>
                <IonSelect
                  interface="action-sheet"
                  onIonChange={(e) =>
                    handleChangeFieldValue(field, e.target.value)
                  }
                  placeholder="Bank Name"
                  style={{ width: "100%" }}
                >
                  {bankList().map((n, i) => (
                    <IonSelectOption value={n.value} key={i}>
                      {n.label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </div>
        );
      }

      if (field === "coinAddress") {
        return (
          <div key={field} className={focusedClass}>
            <CustomInputScan
              type="text"
              label={formatMessage({
                id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
              })}
              placeholder={formatMessage({
                id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
              })}
              defaultLabel={field}
              handleChangeInput={(value) =>
                handleChangeFieldValue(field, value)
              }
              // @ts-ignore
              inputValue={getState(field)}
              handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
              classNameLabel="cr-email-form__label"
              classNameInput="input-icon"
              autoFocus={false}
              handleIconClick={handleIconClick}
              icon="scan-outline"
            />
          </div>
        );
      }

      if (field === "coinBeneficiaryName") {
        return (
          <div key={field} className={focusedClass}>
            <CustomInput
              type="text"
              label={formatMessage({
                id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
              })}
              placeholder="My Wallet"
              defaultLabel={field}
              handleChangeInput={(value) =>
                handleChangeFieldValue(field, value)
              }
              // @ts-ignore
              inputValue={getState(field)}
              handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
              onKeyPress={() => handleChangeFieldFocus(`${field}Focused`)}
              classNameLabel="cr-email-form__label"
              classNameInput="cr-email-form__input"
              autoFocus={false}
            />
          </div>
        );
      }

      if (field === "fiatName") {
        return (
          <div key={field} className={focusedClass}>
            <CustomInput
              type="text"
              label={formatMessage({
                id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
              })}
              placeholder="My BCA"
              defaultLabel={field}
              handleChangeInput={(value) =>
                handleChangeFieldValue(field, value)
              }
              // @ts-ignore
              inputValue={getState(field)}
              handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
              onKeyPress={() => handleChangeFieldFocus(`${field}Focused`)}
              classNameLabel="cr-email-form__label"
              classNameInput="cr-email-form__input"
              autoFocus={false}
            />
          </div>
        );
      }

      if (field === "fiatFullName") {
        return (
          <div key={field} className={focusedClass}>
            <CustomInput
              type="text"
              label={formatMessage({
                id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
              })}
              placeholder="My BCA"
              defaultLabel={field}
              handleChangeInput={(value) =>
                handleChangeFieldValue(field, value)
              }
              // @ts-ignore
              inputValue={getState(field)}
              handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
              onKeyPress={() => handleChangeFieldFocus(`${field}Focused`)}
              classNameLabel="cr-email-form__label"
              classNameInput="cr-email-form__input"
              autoFocus={false}
              readOnly={true}
            />
          </div>
        );
      }

      return (
        <div key={field} className={focusedClass}>
          <CustomInput
            type="text"
            label={formatMessage({
              id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
            })}
            placeholder={formatMessage({
              id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
            })}
            defaultLabel={field}
            handleChangeInput={(value) => handleChangeFieldValue(field, value)}
            // @ts-ignore
            inputValue={getState(field)}
            handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
            onKeyPress={() => handleChangeFieldFocus(`${field}Focused`)}
            classNameLabel="cr-email-form__label"
            classNameInput="cr-email-form__input"
            autoFocus={false}
          />
        </div>
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [formatMessage, getState]
  );

  const renderInvalidAddressMessage = React.useMemo(() => {
    return (
      <div className="">
        <span className="pg-beneficiaries__error-text">
          {formatMessage({
            id: "page.body.wallets.beneficiaries.addAddressModal.body.invalidAddress",
          })}
        </span>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinAddress]);

  const handleChangenBlockchain = (index: number) => {
    const blockchainItem = currencyItem.networks[index];
    setCoinBlockchainName({
      blockchainKey: blockchainItem.blockchain_key,
      protocol: blockchainItem.protocol,
      name: currencyItem.name,
      id: currencyItem.id,
      fee: blockchainItem?.withdraw_fee,
      minWithdraw: blockchainItem.min_withdraw_amount,
    });
  };

  const renderAddAddressModalCryptoBody = React.useMemo(() => {
    const isDisabled =
      !coinAddress ||
      !coinBeneficiaryName ||
      !coinAddressValid ||
      !coinBlockchainName.blockchainKey;
    const networks = currencyItem.networks;

    return (
      <div className="cr-email-form__form-content pl-0 pr-0 pb-2 add-beneficiaries">
        {renderAddAddressModalBodyItem("coinAddress")}
        {!coinAddressValid && coinAddress && renderInvalidAddressMessage}
        {networks && (
          <>
            <div className="text-small">Blockhcain Network</div>
            <IonList className="bg-body">
              <IonItem className="input-blockchain">
                <IonSelect
                  interface="action-sheet"
                  onIonChange={(e) => handleChangenBlockchain(e.target.value)}
                  placeholder={formatMessage({
                    id: "page.body.wallets.beneficiaries.dropdown.blockchain.networks",
                  })}
                  style={{ width: "100%" }}
                >
                  {networks.map((n, i) => (
                    <IonSelectOption value={i} key={i}>
                      {n.protocol}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </>
        )}

        {renderAddAddressModalBodyItem("coinBeneficiaryName")}
        {renderAddAddressModalBodyItem("coinDescription", true)}
        {isRipple && renderAddAddressModalBodyItem("coinDestinationTag", true)}

        <div className="form-button-group" style={{ minHeight: 60 }}>
          <IonButton
            expand="block"
            type="button"
            onClick={handleSubmitAddAddressCoinModal}
            className="btn-koinku"
            color="primary"
            disabled={isDisabled}
          >
            {formatMessage({
              id: "page.body.wallets.beneficiaries.addAddressModal.body.button",
            })}
          </IonButton>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinAddress, coinBeneficiaryName, coinDescription, coinDestinationTag]);

  const handleSubmitAddAddressFiatModal = React.useCallback(() => {
    const data: BeneficiaryBank = {
      full_name: fiatFullName,
      account_number: fiatAccountNumber,
      bank_name: fiatBankName,
      ...(fiatBankSwiftCode && { bank_swift_code: fiatBankSwiftCode }),
      ...(fiatIntermediaryBankName && {
        intermediary_bank_name: fiatIntermediaryBankName,
      }),
      ...(fiatIntermediaryBankSwiftCode && {
        intermediary_bank_swift_code: fiatIntermediaryBankSwiftCode,
      }),
    };

    const payload = {
      currency: currency || "",
      name: fiatName,
      data: JSON.stringify(data),
    };

    dispatch(beneficiariesCreate(payload));
    handleClearModalsInputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fiatAccountNumber,
    fiatBankName,
    fiatBankSwiftCode,
    fiatFullName,
    fiatIntermediaryBankName,
    fiatIntermediaryBankSwiftCode,
    fiatName,
  ]);

  const renderAddAddressModalFiatBody = React.useMemo(() => {
    const isDisabled =
      !fiatName || !fiatFullName || !fiatAccountNumber || !fiatBankName;

    return (
      <div className="cr-email-form__form-content pl-0 pr-0">
        {renderAddAddressModalBodyItem("fiatName")}
        {renderAddAddressModalBodyItem("fiatFullName")}
        {renderAddAddressModalBodyItem("fiatAccountNumber")}
        {renderAddAddressModalBodyItem("fiatBankName")}
        <div className="cr-email-form__button-wrapper">
          <IonButton
            expand="block"
            type="button"
            onClick={handleSubmitAddAddressFiatModal}
            className="btn-koinku"
            color="primary"
            disabled={isDisabled}
          >
            {formatMessage({
              id: "page.body.wallets.beneficiaries.addAddressModal.body.button",
            })}
          </IonButton>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fiatAccountNumber,
    fiatBankName,
    fiatFullName,
    fiatName,
    fiatBankSwiftCode,
    fiatIntermediaryBankName,
    fiatIntermediaryBankSwiftCode,
  ]);

  const renderContent = React.useCallback(() => {
    const addModalClass = classnames("beneficiaries-add-address-modal", {
      "beneficiaries-add-address-modal--coin": type === "coin",
      "beneficiaries-add-address-modal--fiat": type === "fiat",
    });

    return (
      <div className={addModalClass}>
        <div className="cr-email-form">
          {type === "coin"
            ? renderAddAddressModalCryptoBody
            : renderAddAddressModalFiatBody}
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isMobileDevice, getState]);

  return (
    <React.Fragment>
      <div className="t1 mt-2 mb-2">
        {formatMessage({
          id: "page.body.wallets.beneficiaries.addAddressModal.header",
        })}
      </div>
      {renderContent()}
    </React.Fragment>
  );
};

export const BeneficiariesAddModal = React.memo(BeneficiariesAddModalComponent);
