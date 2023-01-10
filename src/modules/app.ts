import { combineReducers } from 'redux';
import { configUpdateReducer } from './admin/config';
import { alertReducer  } from './public/alert';
import { blockchainsReducer } from './public/blockchains';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { configsReducer } from './public/configs';
import { blogsReducer } from './public/blog';
import { currenciesReducer } from './public/currencies';
import { errorHandlerReducer } from './public/errorHandler';
import { changeColorThemeReducer  } from './public/globalSettings';
import { changeLanguageReducer  } from './public/i18n';
import { klineReducer  } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import { depthReducer, incrementDepthReducer, orderBookReducer } from './public/orderBook';
import { rangerReducer  } from './public/ranger/reducer';
import { recentTradesReducer  } from './public/recentTrades';
import { withdrawLimitsReducer  } from './public/withdrawLimits';
import { apiKeysReducer } from './user/apiKeys';
import { ektpReducer } from './user/kyc/ektp';
import { abilitiesReducer } from './user/abilities';
import { authReducer  } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { documentationReducer } from './user/documentation';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { confirmationCodeReducer } from './user/emailVerificationCode';
import { historyReducer  } from './user/history';
import { internalTransfersReducer } from './user/internalTransfers';
import {
    addressesReducer,
    documentsReducer,
    identityReducer,
    labelReducer,
    phoneReducer,
} from './user/kyc';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer  } from './user/orders';
import { ordersHistoryReducer  } from './user/ordersHistory';
import { passwordReducer  } from './user/password';
import { profileReducer  } from './user/profile';
import { userActivityReducer  } from './user/userActivity';
import { userReferralReducer  } from './user/userReferral';
import { userDeleteReducer  } from './user/userDelete';
import { walletsReducer  } from './user/wallets';
import { withdrawLimitReducer  } from './user/withdrawLimit';
import { marketsAdminReducer } from './admin/markets';
import { platformCreateReducer } from './admin/platform';
import { feeGroupReducer } from './user/feeGroup';

export const publicReducer = combineReducers({
    alerts: alertReducer,
    blockchains: blockchainsReducer,
    blocklistAccess: blocklistAccessReducer,
    colorTheme: changeColorThemeReducer,
    configs: configsReducer,
    blogs: blogsReducer,
    currencies: currenciesReducer,
    errorHandler: errorHandlerReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    markets: marketsReducer,
    memberLevels: memberLevelsReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    incrementDepth: incrementDepthReducer,
    ranger: rangerReducer,
    recentTrades: recentTradesReducer,
    withdrawLimits: withdrawLimitsReducer,
});

export const userReducer = combineReducers({
    addresses: addressesReducer,
    apiKeys: apiKeysReducer,
    ektp: ektpReducer,
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    captcha: getGeetestCaptchaReducer,
    documentation: documentationReducer,
    history: historyReducer,
    documents: documentsReducer,
    identity: identityReducer,
    label: labelReducer,
    phone: phoneReducer,
    openOrders: openOrdersReducer,
    orders: ordersReducer,
    ordersHistory: ordersHistoryReducer,
    password: passwordReducer,
    profile: profileReducer,
    sendEmailVerification: sendEmailVerificationReducer,
    userActivity: userActivityReducer,
    userReferral: userReferralReducer,
    userDelete: userDeleteReducer,
    wallets: walletsReducer,
    feeGroup: feeGroupReducer,
    withdrawLimit: withdrawLimitReducer,
    internalTransfers: internalTransfersReducer,
    abilities: abilitiesReducer,
    confirmationCode: confirmationCodeReducer,
});

export const adminReducer = combineReducers({
    configUpdate: configUpdateReducer,
    markets: marketsAdminReducer,
    platform: platformCreateReducer,
});