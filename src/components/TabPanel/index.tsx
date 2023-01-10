import classnames from "classnames";
import * as React from "react";
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
export enum HideMode {
  hide = "hide",
  unmount = "unmount",
}

export type OnTabChangeCallback = (
  index: number,
  label?: string | JSX.Element
) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Tab {
  content: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  label: string | JSX.Element;
}

export interface TabPanelProps {
  /**
   * List of tabs to be rendered
   */
  panels: Tab[];
  /**
   * Determines whether tabs should be full container width
   * @default false
   */
  fixed?: boolean;
  /**
   * Tab change mode:
   * `hide` mode will mount but hide inactive tabs changing `display` css
   * property of tab content to `none`.
   * `unmount` mode will not mount the tab content of inactive tabs.
   * @default hide
   */
  hideMode?: HideMode;
  /**
   * Callback which is called when currently active tab is changed
   */
  onTabChange?: OnTabChangeCallback;
  /**
   * Function which is called for changing currently active tab is changed
   */
  onCurrentTabChange?: OnCurrentTabChange;
  /**
   * Index of tab to switch on
   */
  /**
   * Current index of tab
   */
  currentTabIndex: number;
  style?: string;
  /**
   * Optinal JSX element to head
   */
  optionalHead?: React.ReactNode;
  /**
   * Determines whether tab header should looks like dropdown or tab switcher
   */
  isMobileDevice?: boolean;
}

/**
 * Component for switching between different tabs on one page.
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  fixed,
  hideMode = HideMode.hide,
  panels,
  optionalHead,
  style,
  currentTabIndex,
  isMobileDevice,
  onCurrentTabChange,
  onTabChange,
}) => {
  const dropdownLabels = React.useCallback(() => {
    if (!panels.length) {
      return [];
    }

    const tabNames = panels
      .map((panel) => panel.label)
      .filter((label) => label !== panels[currentTabIndex].label);
    tabNames.unshift(panels[currentTabIndex].label);

    return tabNames;
  }, [currentTabIndex, panels]);

  const createOnTabChangeHandler = React.useCallback(
    (index: number, tab: Tab) => () => {
      if (!tab.disabled) {
        if (onCurrentTabChange) {
          onCurrentTabChange(index);
        }
        if (onTabChange) {
          onTabChange(index, tab.label);
        }
      }
    },
    [onCurrentTabChange, onTabChange]
  );

  const handleOrderTypeChange = React.useCallback(
    (index: number) => {
      const currentLabels = dropdownLabels();

      const activeIndex = panels.findIndex(
        (tab) => tab.label === currentLabels[index]
      );

      createOnTabChangeHandler(activeIndex, panels[activeIndex])();
    },
    [createOnTabChangeHandler, dropdownLabels, panels]
  );

  const renderTabPanel = React.useCallback(
    (tab: Tab, index: number) => {
      const { label } = tab;
      return (
        <IonSegmentButton
          value={label.toString()}
          key={index}
          onClick={createOnTabChangeHandler(index, tab)}
        >
          <IonLabel>{label}</IonLabel>
        </IonSegmentButton>
      );
    },
    [createOnTabChangeHandler, currentTabIndex]
  );

  const tabPanelRender = React.useCallback(() => {
    return (
      <IonSegment value={panels[currentTabIndex].label.toString()}>
        {panels.map(renderTabPanel)}
      </IonSegment>
    );
  }, [
    dropdownLabels,
    handleOrderTypeChange,
    isMobileDevice,
    panels,
    renderTabPanel,
  ]);

  const renderTabContent = React.useCallback(
    (tab: Tab, index: number) => {
      return <div key={`${tab.label}-${index}`}>{tab.content}</div>;
    },
    [currentTabIndex, hideMode]
  );

  const contents = React.useMemo(
    () =>
      hideMode === HideMode.hide
        ? panels.map(renderTabContent)
        : panels
            .filter((panel, index) => index === currentTabIndex)
            .map(renderTabContent),
    [currentTabIndex, hideMode, panels, renderTabContent]
  );

  return (
    <React.Fragment>
      {tabPanelRender()}
      <div className="tab-content">{contents}</div>
    </React.Fragment>
  );
};
