import React, { useCallback, useEffect, useState } from "react";

import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  beneficiariesCreateData,
  beneficiariesDelete,
  Beneficiary,
  BeneficiaryBank,
  memberLevelsFetch,
  selectBeneficiaries,
  selectBeneficiariesActivateSuccess,
  selectBeneficiariesCreate,
  selectBeneficiariesCreateSuccess,
  selectMemberLevels,
  selectMobileDeviceState,
  selectUserInfo,
  sendError,
  beneficiariesResetState,
  selectBeneficiariesDeleteSuccess,
} from "../../modules";
import { PlusIcon } from "../../assets/images/PlusIcon";
import { BeneficiariesActivateModal } from "./BeneficiariesActivateModal";
import { BeneficiariesAddModal } from "./BeneficiariesAddModal";
import { BeneficiariesFailAddModal } from "./BeneficiariesFailAddModal";
import { TabPanel } from "../TabPanel";
import { SelectBeneficiariesCrypto } from "./BeneficiariesCrypto/SelectBeneficiariesCrypto";

import {
  IonHeader,
  IonPage,
  IonIcon,
  IonText,
  IonItem,
  IonButton,
  IonInput,
  IonLabel,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  useIonActionSheet,
} from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import "./style.css";

interface OwnProps {
  currency: string;
  type: "fiat" | "coin";
  onChangeValue: (beneficiary: Beneficiary) => void;
}

const defaultBeneficiary: Beneficiary = {
  id: 0,
  currency: "",
  name: "",
  blockchain_key: "",
  blockchain_name: "",
  state: "",
  data: {
    address: "",
  },
};

type Props = OwnProps;

const BeneficiariesComponent: React.FC<Props> = (props: Props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [present, dismiss] = useIonActionSheet();

  const [tab, setTab] = React.useState(
    formatMessage({
      id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
    })
  );
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

  const [currentWithdrawalBeneficiary, setWithdrawalBeneficiary] =
    React.useState(defaultBeneficiary);
  const [showDialog, setShowDialog] = React.useState(false);
  const [benId, setBenId] = React.useState(0);
  const [isOpenAddressModal, setAddressModalState] = React.useState(false);
  const [isOpenConfirmationModal, setConfirmationModalState] =
    React.useState(false);
  const [isOpenFailModal, setFailModalState] = React.useState(false);
  const isOpenTip = false;
  const { currency, type, onChangeValue } = props;

  /*    selectors    */
  const beneficiaries = useSelector(selectBeneficiaries);
  const beneficiariesAddData = useSelector(selectBeneficiariesCreate);
  const beneficiariesAddSuccess = useSelector(selectBeneficiariesCreateSuccess);
  const beneficiariesActivateSuccess = useSelector(
    selectBeneficiariesActivateSuccess
  );
  const beneficiariesDeleteSuccess = useSelector(
    selectBeneficiariesDeleteSuccess
  );
  const memberLevels = useSelector(selectMemberLevels);
  const userData = useSelector(selectUserInfo);
  const isMobileDevice = useSelector(selectMobileDeviceState);

  const uniqueBlockchainKeys = new Set(
    beneficiaries.map((item) => item.blockchain_key)
  );
  const uniqueBlockchainKeysValues = [...uniqueBlockchainKeys.values()];
  const filteredBeneficiaries = beneficiaries.filter((obj) =>
    obj.currency.toLowerCase().includes(currency.toLowerCase())
  );

  React.useEffect(() => {
    if (beneficiaries.length && beneficiaries[0].currency !== currency) {
      setWithdrawalBeneficiary(defaultBeneficiary);
      setCurrentTabIndex(0);
      setTab(
        formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
        })
      );
    }
  }, [currency]);

  React.useEffect(() => {
    if (beneficiaries.length) {
      setCurrentTabIndex(0);
      setTab(
        formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.whitelisted",
        })
      );
    }
  }, [isOpenConfirmationModal]);

  React.useEffect(() => {
    if (beneficiaries.length) {
      handleSetCurrentAddressOnUpdate(beneficiaries);
    }

    if (!memberLevels) {
      dispatch(memberLevelsFetch());
    }
  }, []);

  React.useEffect(() => {
    if (currency || beneficiariesDeleteSuccess) {
      dispatch(beneficiariesResetState());
    }
  }, [currency, beneficiariesDeleteSuccess]);

  React.useEffect(() => {
    if (filteredBeneficiaries.length) {
      handleSetCurrentAddressOnUpdate(filteredBeneficiaries);
    }

    if (beneficiariesAddSuccess) {
      setConfirmationModalState(true);
    }

    if (beneficiariesActivateSuccess) {
      setConfirmationModalState(false);
      setAddressModalState(false);
    }

    if (beneficiaries.length) {
      setTab(
        formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.whitelisted",
        })
      );
      setCurrentTabIndex(0);
    } else {
      setTab(
        formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
        })
      );
    }
  }, [beneficiaries, beneficiariesAddSuccess, beneficiariesActivateSuccess]);

  const handleConfirmDeleteAddress = (item: Beneficiary) => () => {
    present({
      header: "Delete Order",
      subHeader: "Are you sure want delete this address?",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Yes, Im Sure",
          role: "destructive",
          handler: () => {
            dispatch(beneficiariesDelete({ id: item.id }));
            dismiss();
          },
          data: {
            action: "delete",
          },
        },
        {
          text: "Close",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
    });
  };

  const handleClickSelectAddress = React.useCallback(
    (item: Beneficiary) => () => {
      if (item.state && item.state.toLowerCase() === "pending") {
        dispatch(beneficiariesCreateData(item));
        setConfirmationModalState(true);
      } else {
        handleSetCurrentAddress(item);
        setConfirmationModalState(false);
        setAddressModalState(false);
      }
    },
    []
  );

  const handleSetCurrentAddress = React.useCallback(
    (item: Beneficiary) => {
      if (item.data) {
        setWithdrawalBeneficiary(item);
        onChangeValue(item);
      }
    },
    [currency]
  );

  const handleFilterByState = React.useCallback(
    (beneficiariesList: Beneficiary[], filter: string | string[]) => {
      if (beneficiariesList.length) {
        return beneficiariesList.filter((item) =>
          filter.includes(item.state.toLowerCase())
        );
      }

      return [];
    },
    []
  );

  const handleClickToggleAddAddressModal = React.useCallback(
    () => () => {
      if (
        memberLevels &&
        userData.level < memberLevels.withdraw.minimum_level
      ) {
        setFailModalState(true);
      } else if (beneficiaries && beneficiaries.length >= 25) {
        dispatch(
          sendError({
            error: { message: ["error.beneficiaries.max10.addresses"] },
            processingType: "alert",
          })
        );
      } else {
        setAddressModalState(true);
      }
    },
    [beneficiaries]
  );

  const handleSetCurrentAddressOnUpdate = React.useCallback(
    (beneficiariesList: Beneficiary[]) => {
      let filteredByState = handleFilterByState(beneficiariesList, "active");

      if (!filteredByState.length) {
        filteredByState = handleFilterByState(beneficiariesList, "pending");
      }

      if (filteredByState.length) {
        handleSetCurrentAddress(filteredByState[0]);
      }
    },
    []
  );

  const renderAddAddress = React.useMemo(() => {
    return (
      <>
        <div className="text-extra-small">Withdraw Address</div>
        <div
          className="separate input-beneficiary"
          onClick={handleClickToggleAddAddressModal()}
        >
          <div>
            {formatMessage({
              id: "page.body.wallets.beneficiaries.addAddress",
            })}
          </div>
          <div className="icon-combo">
            <IonIcon icon={chevronDownOutline}></IonIcon>
          </div>
        </div>
      </>
    );
  }, [formatMessage]);

  const renderDropdownTipCryptoNote = React.useCallback((note: string) => {
    return (
      <div className="tip__content__block">
        <span className="tip__content__block__label">
          {formatMessage({
            id: "page.body.wallets.beneficiaries.tipDescription",
          })}
        </span>
        <span className="tip__content__block__value">{note}</span>
      </div>
    );
  }, []);

  const renderDropdownTipCrypto = React.useCallback(
    (currentWithdrawalBeneficiary: Beneficiary) => {
      if (currentWithdrawalBeneficiary) {
        return (
          <div className="pg-beneficiaries__dropdown__tip tip">
            <div className="tip__content">
              <div className="tip__content__block">
                <span className="tip__content__block__label">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.tipAddress",
                  })}
                </span>
                <span className="tip__content__block__value">
                  {currentWithdrawalBeneficiary.data.address}
                </span>
              </div>
              <div className="tip__content__block">
                <span className="tip__content__block__label">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.tipName",
                  })}
                </span>
                <span className="tip__content__block__value">
                  {currentWithdrawalBeneficiary.name}
                </span>
              </div>
              {currentWithdrawalBeneficiary.description &&
                renderDropdownTipCryptoNote(
                  currentWithdrawalBeneficiary.description
                )}
            </div>
          </div>
        );
      }

      return null;
    },
    []
  );

  const renderDropdownTipFiatDescription = (description: string) => {
    return (
      <div className="tip__content__block">
        <span className="tip__content__block__label">
          {formatMessage({
            id: "page.body.wallets.beneficiaries.dropdown.fiat.description",
          })}
        </span>
        <span className="tip__content__block__value">{description}</span>
      </div>
    );
  };

  const renderDropdownTipFiat = React.useCallback(
    (currentWithdrawalBeneficiary: Beneficiary) => {
      if (currentWithdrawalBeneficiary) {
        return (
          <div className="pg-beneficiaries__dropdown__tip tip fiat-tip">
            <div className="tip__content">
              <div className="tip__content__block">
                <span className="tip__content__block__label">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.dropdown.fiat.name",
                  })}
                </span>
                <span className="tip__content__block__value">
                  {currentWithdrawalBeneficiary.name}
                </span>
              </div>
              {currentWithdrawalBeneficiary.description &&
                renderDropdownTipFiatDescription(
                  currentWithdrawalBeneficiary.description
                )}
              <div className="tip__content__block">
                <span className="tip__content__block__label">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.dropdown.fiat.account",
                  })}
                </span>
                <span className="tip__content__block__value">
                  {
                    (currentWithdrawalBeneficiary.data as BeneficiaryBank)
                      .account_number
                  }
                </span>
              </div>
              <div className="tip__content__block">
                <span className="tip__content__block__label">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.dropdown.fiat.bankOfBeneficiary",
                  })}
                </span>
                <span className="tip__content__block__value">
                  {
                    (currentWithdrawalBeneficiary.data as BeneficiaryBank)
                      .bank_name
                  }
                </span>
              </div>
            </div>
          </div>
        );
      }

      return null;
    },
    []
  );

  const renderAddressItem = React.useCallback(
    (currentBeneficiary: Beneficiary) => {
      const isPending =
        currentBeneficiary.state &&
        currentBeneficiary.state.toLowerCase() === "pending";

      if (type === "fiat") {
        return (
          <div className="pg-beneficiaries__dropdown">
            <div
              className="pg-beneficiaries__dropdown__select fiat-select select"
              onClick={handleClickToggleAddAddressModal()}
            >
              <div className="select__left">
                <span className="select__left__title">Bank</span>
                <span className="select__left__address">
                  {currentBeneficiary.data
                    ? (
                        currentBeneficiary.data as BeneficiaryBank
                      ).bank_name.split("[")[0]
                    : ""}
                </span>
                <span className="select__left__title">Account Number</span>
                <span className="select__left__address">
                  {currentBeneficiary.data
                    ? (currentBeneficiary.data as BeneficiaryBank)
                        .account_number
                    : ""}
                </span>
              </div>
              <div className="select__right">
                {isPending ? (
                  <span className="select__right__pending">
                    {formatMessage({
                      id: "page.body.wallets.beneficiaries.dropdown.pending",
                    })}
                  </span>
                ) : null}
                <span className="select__right__select">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.dropdown.select",
                  })}
                </span>
                <span className="select__right__chevron">
                  <IonIcon icon={chevronDownOutline} />
                </span>
              </div>
            </div>
            {isOpenTip && renderDropdownTipFiat(currentBeneficiary)}
          </div>
        );
      }

      return (
        <div className="pg-beneficiaries__dropdown">
          <div
            className="pg-beneficiaries__dropdown__select select"
            onClick={handleClickToggleAddAddressModal()}
          >
            <div className="select__left">
              <span className="select__left__title">
                {currentWithdrawalBeneficiary.name}
              </span>
              <span className="select__left__address">
                <span>{currentWithdrawalBeneficiary.data?.address}</span>
              </span>
              <span className="item__left__title"></span>
            </div>
            <div className="select__right">
              {isPending ? (
                <span className="select__right__pending">
                  {formatMessage({
                    id: "page.body.wallets.beneficiaries.dropdown.pending",
                  })}
                </span>
              ) : null}
              <span className="select__right__select">
                {formatMessage({
                  id: "page.body.wallets.beneficiaries.dropdown.select",
                })}
              </span>
              <span className="select__right__chevron">
                <IonIcon icon={chevronDownOutline} />
              </span>
            </div>
          </div>
          {isOpenTip && renderDropdownTipCrypto(currentWithdrawalBeneficiary)}
        </div>
      );
    },
    [currentWithdrawalBeneficiary, isOpenTip]
  );

  const CloseMod = () => {
    setCurrentTabIndex(0);
    setTab(
      formatMessage({
        id: "page.body.wallets.beneficiaries.tab.panel.whitelisted",
      })
    );
  };

  const renderBeneficiariesAddModal = React.useMemo(() => {
    return (
      <BeneficiariesAddModal
        currency={currency}
        type={type}
        handleToggleAddAddressModal={() => CloseMod()}
      />
    );
  }, [currency, type]);

  const renderActivateModal = React.useMemo(() => {
    return (
      <BeneficiariesActivateModal
        beneficiariesAddData={beneficiariesAddData}
        handleToggleConfirmationModal={() => setConfirmationModalState(false)}
      />
    );
  }, [beneficiariesAddData]);

  const renderFailModal = React.useMemo(() => {
    return (
      <BeneficiariesFailAddModal
        isMobileDevice={isMobileDevice}
        handleToggleFailModal={() => setFailModalState(false)}
      />
    );
  }, []);

  const handleCloseModals = useCallback(() => {
    if (beneficiaries.length) {
      setTab(
        formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.whitelisted",
        })
      );
    } else {
      setTab(
        formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
        })
      );
    }
    setCurrentTabIndex(0);
    setConfirmationModalState(false);
    setAddressModalState(false);
  }, [
    beneficiaries,
    currentTabIndex,
    isOpenAddressModal,
    isOpenConfirmationModal,
  ]);

  const onTabChange = (label) => setTab(label);

  const onCurrentTabChange = (index) => setCurrentTabIndex(index);

  const renderTabs = React.useMemo(() => {
    if (beneficiaries.length) {
      //nek ono isine beneficeri
      return [
        {
          content:
            tab ===
            formatMessage({
              id: "page.body.wallets.beneficiaries.tab.panel.whitelisted",
            })
              ? uniqueBlockchainKeysValues.map((item) => (
                  <SelectBeneficiariesCrypto
                    blockchainKey={item}
                    currency={currency}
                    handleDeleteAddress={handleConfirmDeleteAddress}
                    handleClickSelectAddress={handleClickSelectAddress}
                  />
                ))
              : null,
          label: formatMessage({
            id: "page.body.wallets.beneficiaries.tab.panel.whitelisted",
          }),
        },
        {
          content:
            tab ===
            formatMessage({
              id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
            })
              ? renderBeneficiariesAddModal
              : null,
          label: formatMessage({
            id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
          }),
        },
      ];
    }

    return [
      //nek gaono isine
      {
        content:
          tab ===
          formatMessage({
            id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
          })
            ? renderBeneficiariesAddModal
            : null,
        label: formatMessage({
          id: "page.body.wallets.beneficiaries.tab.panel.add.whitelisted",
        }),
      },
    ];
  }, [tab, isOpenConfirmationModal, isOpenFailModal, beneficiaries]);

  const renderTabPanel = React.useMemo(() => {
    if (isOpenConfirmationModal) {
      return renderActivateModal;
    }
    if (isOpenFailModal) {
      return renderFailModal;
    }
    return (
      <TabPanel
        panels={renderTabs}
        onTabChange={(_, label) => onTabChange(label)}
        currentTabIndex={currentTabIndex}
        onCurrentTabChange={onCurrentTabChange}
      />
    );
  }, [isOpenAddressModal, isOpenConfirmationModal, isOpenFailModal, tab]);

  const renderTitle = React.useMemo(() => {
    if (isOpenConfirmationModal) {
      return "Confirm New Account";
    }

    return "Withdrawal Address";
  }, [isOpenConfirmationModal]);

  return (
    <React.Fragment>
      <div className="pg-beneficiaries">
        {filteredBeneficiaries.length &&
        currentWithdrawalBeneficiary.id &&
        currentWithdrawalBeneficiary.currency ===
          filteredBeneficiaries[0].currency
          ? renderAddressItem(currentWithdrawalBeneficiary)
          : renderAddAddress}
        <IonModal isOpen={isOpenAddressModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{renderTitle}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => handleCloseModals()}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding bg-body">
            {renderTabPanel}
          </IonContent>
        </IonModal>
      </div>
    </React.Fragment>
  );
};

const Beneficiaries = React.memo(BeneficiariesComponent);

export { Beneficiaries };
