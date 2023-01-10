import { AbilitiesInterface, Wallet } from '../modules';

export const PG_TITLE_PREFIX = 'Naga Exchange';

export const pgRoutes = (isLoggedIn: boolean, abilities: AbilitiesInterface, isLight?: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.wallets', '/user/wallets', `wallets${isLight ? 'Light' : ''}`],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
        ['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`],
        ['page.header.navbar.internal.transfer', '/internal-transfer', `internal_transfer${isLight ? 'Light' : ''}`],
        ['page.header.navbar.api', '/docs', `api${isLight ? 'Light' : ''}`],
    ];

    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/login', `signin${isLight ? 'Light' : ''}`],
        ['page.header.signUp', '/register', `signup${isLight ? 'Light' : ''}`],
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.api', '/docs', `api${isLight ? 'Light' : ''}`],
    ];

    return isLoggedIn ? routes.filter(i => Boolean(i)) : routesUnloggedIn;
};

export const DEFAULT_WALLET: Wallet = {
    name: '',
    currency: '',
    balance: '',
    type: 'coin',
    fixed: 0,
    networks: [{blockchain_key: '', fee: 0, protocol: ''}],
    account_type: '',
};

export const GLOBAL_PLATFORM_CURRENCY = 'IDR';

export const DEFAULT_CCY_PRECISION = 0;
export const DEFAULT_FIAT_PRECISION = 0;
export const DEFAULT_TRADING_VIEW_INTERVAL = '15';
export const VALUATION_PRIMARY_CURRENCY = 'IDR';
export const VALUATION_SECONDARY_CURRENCY = 'USDT';

export const PASSWORD_ENTROPY_STEP = 6;

export const DEFAULT_KYC_STEPS = ['email', 'phone', 'profile', 'document', 'address'];

export const DEFAULT_MARKET_HEADERS = ['Pair', 'Price', '24h Change'];

export const TRANSFER_TYPES_LIST = ['Spot', 'P2P'];

export const DEFAULT_ORDER_TYPES= ['Limit', 'Market'];
export const AMOUNT_PERCENTAGE_ARRAY = [0.25, 0.5, 0.75, 1];
export const DEFAULT_TABLE_PAGE_LIMIT = 25;

export const HOST_URL = 'https://www.heavenexchange.io';

export const P2P_TIME_LIMIT_LIST = ['15 min', '30 min', '60 min'];
export const ORDER_TYPES_WITH_TRIGGER = ['Stop-loss', 'Take-profit', 'Stop-limit', 'Take-limit'];

export const TRIGGER_BUY_PRICE_MULT = 1.1;
export const TRIGGER_BUY_PRICE_ADJUSTED_TYPES = ['stop-loss', 'take-profit'];

export const DEFAULT_MARKET = {
    id: '',
    name: '',
    base_unit: '',
    quote_unit: '',
    min_price: '',
    max_price: 0,
    min_amount: 0,
    amount_precision: 0,
    price_precision: 0,
};

export const colors = {
    light: {
        chart: {
            primary: '#fff',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            sun: 'var(--icons)',
            moon: 'var(--primary-text-color)',
        },
        orderBook: {
            asks: '#ffe8e1',
            bids: '#e6f5ec',
        },
        depth: {
            fillAreaAsk: '#fa5252',
            fillAreaBid: '#12b886',
            gridBackgroundStart: '#1a243b',
            gridBackgroundEnd: '#1a243b',
            strokeAreaAsk: '#fa5252',
            strokeAreaBid: '#12b886',
            strokeGrid: '#B8E9F5',
            strokeAxis: '#cccccc',
        },
    },
    dark: {
        chart: {
            primary: 'var(--body-background-color)',
            up: 'var(--rgb-bids)',
            down: 'var(--rgb-asks)',
        },
        navbar: {
            sun: 'var(--primary-text-color)',
            moon: 'var(--icons)',
        },
        orderBook: {
            asks: 'var(--background-red-transparent)',
            bids: 'var(--background-green-transparent)',
        },
        depth: {
            fillAreaAsk: 'var(--rgb-asks)',
            fillAreaBid: 'var(--rgb-bids)',
            gridBackgroundStart: 'var(--rgb-asks)',
            gridBackgroundEnd: 'var(--rgb-asks)',
            strokeAreaAsk: 'var(--rgb-asks)',
            strokeAreaBid: 'var(--rgb-bids)',
            strokeGrid: 'var(--rgb-secondary-contrast-cta-color)',
            strokeAxis: 'var(--rgb-primary-text-color)',
        },
    },
};
