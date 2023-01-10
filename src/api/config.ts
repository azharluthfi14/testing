const hostUrl = 'https://www.heavenexchange.io';

const protocolSSL = window.location.protocol === 'http:' ? 'wss://' : 'wss://';
const rangerHostUrl =  `${protocolSSL}${`www.heavenexchange.io`}`;
export const defaultConfig: Config = {
    api: {
        authUrl: `${hostUrl}/api/v2/account`,
        tradeUrl: `${hostUrl}/api/v2/exchange`,
        applogicUrl: `${hostUrl}/api/v2/applogic`,
        rangerUrl: `${rangerHostUrl}/api/v2/ranger`,
        finexUrl: `${hostUrl}/api/v2/finex`,
        p2pUrl: `${hostUrl}/api/v2/p2p`,
    },
    finex: false,
    withCredentials: true,
    incrementalOrderBook: false,
    isResizable: false,
    isDraggable: false,
    showLanding: true,
    sentryEnabled: false,
    captchaLogin: false,
    usernameEnabled: false,
    gaTrackerKey: '',
    minutesUntilAutoLogout: '500',
    msAlertDisplayTime: '5000',
    msPricesUpdates: '1000',
    sessionCheckInterval: '15000',
    balancesFetchInterval: '5000',
    passwordEntropyStep: '14',
    storage: {
        defaultStorageLimit: '50',
        orderBookSideLimit: '25'
    },
    languages: ['en'],
    kycSteps: [
        'email',
        'phone',
        'profile',
        'document',
        'address'
    ],
    captcha_type: 'none',
    password_min_entropy: 0,
    wizard_step: undefined,
    account_upload_size_min_range: '1',
    account_upload_size_max_range: '20',
    themeSwitcher: 'visible',
};

export const NagaExchange = {
    config: defaultConfig,
};

NagaExchange.config = { ...defaultConfig, ...window.env };
NagaExchange.config.storage = { ...defaultConfig.storage, ...NagaExchange.config.storage };

const convertToBoolean = (value: any): boolean => {
    return String(value) === 'true';
}

export const tradeUrl = () => NagaExchange.config.api.tradeUrl;
export const authUrl = () => NagaExchange.config.api.authUrl;
export const applogicUrl = () => NagaExchange.config.api.applogicUrl;
export const rangerUrl = () => NagaExchange.config.api.rangerUrl;
export const finexUrl = () => NagaExchange.config.api.finexUrl || tradeUrl();
export const p2pUrl = () => NagaExchange.config.api.p2pUrl;
export const withCredentials = () => convertToBoolean(NagaExchange.config.withCredentials);
export const incrementalOrderBook = () => convertToBoolean(NagaExchange.config.incrementalOrderBook);
export const isResizableGrid = () => convertToBoolean(NagaExchange.config.isResizable);
export const isDraggableGrid = () => convertToBoolean(NagaExchange.config.isDraggable);
export const isFinexEnabled = () => convertToBoolean(NagaExchange.config.finex);
export const showLanding = () => convertToBoolean(NagaExchange.config.showLanding);
export const sentryEnabled = () => convertToBoolean(NagaExchange.config.sentryEnabled);
export const captchaLogin = () => convertToBoolean(NagaExchange.config.captchaLogin);
export const minutesUntilAutoLogout = () => NagaExchange.config.minutesUntilAutoLogout;
export const sessionCheckInterval = () => NagaExchange.config.sessionCheckInterval;
export const balancesFetchInterval = () => NagaExchange.config.balancesFetchInterval;
export const gaTrackerKey = () => NagaExchange.config.gaTrackerKey;
export const msAlertDisplayTime = () => NagaExchange.config.msAlertDisplayTime;
export const msPricesUpdates = () => NagaExchange.config.msPricesUpdates;
export const defaultStorageLimit = () => Number(NagaExchange.config.storage.defaultStorageLimit);
export const orderBookSideLimit = () => Number(NagaExchange.config.storage.orderBookSideLimit);
export const passwordEntropyStep = () => Number(NagaExchange.config.passwordEntropyStep);
export const languages = (NagaExchange.config.languages && NagaExchange.config.languages.length > 0) ? NagaExchange.config.languages : ['en'];
export const kycSteps = () => NagaExchange.config.kycSteps;
export const isUsernameEnabled = () => convertToBoolean(NagaExchange.config.usernameEnabled);
export const captchaType = () => NagaExchange.config.captcha_type;
export const captchaId = () => NagaExchange.config.captcha_id;
export const passwordMinEntropy = () => Number(NagaExchange.config.password_min_entropy);
export const wizardStep = () => String(NagaExchange.config.wizard_step || '1');
export const accountUploadSizeMinRange = Number(NagaExchange.config.account_upload_size_min_range || '1');
export const accountUploadSizeMaxRange = Number(NagaExchange.config.account_upload_size_max_range || '20');
export const themeSwitcher = () => NagaExchange.config.themeSwitcher;
