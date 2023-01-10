import { combineReducers } from 'redux';
import { all, call } from 'redux-saga/effects';
import { adminReducer, publicReducer, userReducer } from './app';
import { ConfigUpdateState, rootConfigUpdateSaga } from './admin/config';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { BlockchainsState } from './public/blockchains';
import { BlocklistAccessState, rootBlocklistAccessSaga } from './public/blocklistAccess';
import { ConfigsState, rootConfigsSaga } from './public/configs';
import { BlogsState, rootblogsSaga } from './public/blog';
import { CurrenciesState } from './public/currencies';
import { ErrorHandlerState, rootErrorHandlerSaga } from './public/errorHandler';
import { ColorThemeState } from './public/globalSettings';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';
import { DepthIncrementState, DepthState, OrderBookState, rootOrderBookSaga } from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { EktpState } from './user/kyc/ektp';
import { rootEktpSaga } from './user/kyc/ektp/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
import { AbilitiesState, rootAbilitiesSaga } from './user/abilities';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { DocumentationState, rootDocumentationSaga } from './user/documentation';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { HistoryState, rootHistorySaga } from './user/history';
import { InternalTransfersState, rootInternalTransfersSaga } from './user/internalTransfers';
import { AddressesState, rootSendAddressesSaga } from './user/kyc/addresses';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { rootWalletsSaga, WalletsState } from './user/wallets';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';
import { MarketsAdminState, rootMarketsAdminSaga } from './admin/markets';
import { PlatformCreateState, rootPlatformCreateSaga } from './admin/platform';
import { rootFeeGroupSaga, FeeGroupState } from './user/feeGroup';
import { rootWithdrawLimitsSaga, WithdrawLimitsState } from './public/withdrawLimits';
import { ConfirmationCodeState, rootConfirmationCodeSaga } from './user/emailVerificationCode';
import { rootUserReferralSaga, UserReferralState } from './user/userReferral';
import { rootUserDeleteSaga, UserDeleteState } from './user/userDelete';


export * from './admin/config';
export * from './admin/markets';
export * from './admin/platform';
export * from './public/alert';
export * from './public/blockchains';
export * from './public/blocklistAccess';
export * from './public/configs';
export * from './public/blog';
export * from './public/currencies';
export * from './public/errorHandler';
export * from './public/globalSettings';
export * from './public/i18n';
export * from './public/kline';
export * from './public/markets';
export * from './public/memberLevels';
export * from './public/orderBook';
export * from './public/recentTrades';
export * from './public/blog';
export * from './public/withdrawLimits';
export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/documentation';
export * from './user/emailVerification';
export * from './user/history';
export * from './user/internalTransfers';
export * from './user/kyc';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/profile';
export * from './user/userActivity';
export * from './user/userReferral';
export * from './user/userDelete';
export * from './user/wallets';
export * from './user/feeGroup';
export * from './user/withdrawLimit';
export * from './user/abilities';
export * from './user/emailVerificationCode';

export interface RootState {
    public: {
        alerts: AlertState;
        blockchains: BlockchainsState;
        blocklistAccess: BlocklistAccessState;
        colorTheme: ColorThemeState;
        configs: ConfigsState;
        blogs: BlogsState;
        currencies: CurrenciesState;
        depth: DepthState;
        errorHandler: ErrorHandlerState;
        i18n: LanguageState;
        incrementDepth: DepthIncrementState;
        kline: KlineState;
        markets: MarketsState;
        memberLevels: MemberLevelsState;
        orderBook: OrderBookState;
        ranger: RangerState;
        recentTrades: RecentTradesState;
        withdrawLimits: WithdrawLimitsState,
    };
    user: {
        abilities: AbilitiesState;
        addresses: AddressesState;
        apiKeys: ApiKeysState;
        ektp: EktpState;
        auth: AuthState;
        beneficiaries: BeneficiariesState;
        captcha: GeetestCaptchaState;
        documentation: DocumentationState;
        documents: DocumentsState;
        history: HistoryState;
        identity: IdentityState;
        internalTransfers: InternalTransfersState;
        label: LabelState;
        openOrders: OpenOrdersState;
        orders: OrdersState;
        ordersHistory: OrdersHistoryState;
        password: PasswordState;
        phone: PhoneState;
        profile: ProfileState;
        sendEmailVerification: EmailVerificationState;
        userActivity: UserActivityState;
        userReferral: UserReferralState;
        userDelete: UserDeleteState;
        wallets: WalletsState;
        withdrawLimit: WithdrawLimitState;
        feeGroup: FeeGroupState;
        confirmationCode: ConfirmationCodeState;
    };
    admin: {
        configUpdate: ConfigUpdateState;
        markets: MarketsAdminState;
        platform: PlatformCreateState;
    };
}

export const rootReducer = combineReducers({
    public: publicReducer,
    user: userReducer,
    admin: adminReducer,
});

export function* rootSaga() {
    yield all([
        call(rootWithdrawLimitsSaga),
        call(rootFeeGroupSaga),
        call(rootAbilitiesSaga),
        call(rootApiKeysSaga),
        call(rootEktpSaga),
        call(rootAuthSaga),
        call(rootBeneficiariesSaga),
        call(rootBlocklistAccessSaga),
        call(rootConfigUpdateSaga),
        call(rootDocumentationSaga),
        call(rootEmailVerificationSaga),
        call(rootErrorHandlerSaga),
        call(rootGeetestCaptchaSaga),
        call(rootHandleAlertSaga),
        call(rootHistorySaga),
        call(rootInternalTransfersSaga),
        call(rootKlineFetchSaga),
        call(rootLabelSaga),
        call(rootMarketsAdminSaga),
        call(rootMarketsSaga),
        call(rootMemberLevelsSaga),
        call(rootblogsSaga),
        call(rootOpenOrdersSaga),
        call(rootOrderBookSaga),
        call(rootOrdersHistorySaga),
        call(rootOrdersSaga),
        call(rootPasswordSaga),
        call(rootPlatformCreateSaga),
        call(rootProfileSaga),
        call(rootRecentTradesSaga),
        call(rootSendAddressesSaga),
        call(rootSendCodeSaga),
        call(rootSendDocumentsSaga),
        call(rootSendIdentitySaga),
        call(rootUserActivitySaga),
        call(rootUserReferralSaga),
        call(rootUserDeleteSaga),
        call(rootWalletsSaga),
        call(rootWithdrawLimitSaga),
        call(rootConfigsSaga),
        call(rootConfirmationCodeSaga),
    ]);
}
