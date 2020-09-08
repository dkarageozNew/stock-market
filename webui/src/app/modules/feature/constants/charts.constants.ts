export enum StockType {
    BTN_USD = 'btcusd',
    TRX_BTC = 'trxbtc',
    LINK_BTC = 'linkbtc',
    XRP_BTC = 'xrpbtc',
    ETH_BTC = 'ethbtc'
}

export enum StockInterval {
    DAY = '1d',
    TWELVE_HOURS = '12hours',
    SIX_HOURS = '6hours',
    ONE_HOUR = 'hour'
}

export const stockCharts: Array<StockType> = [
    StockType.BTN_USD,
    StockType.TRX_BTC,
    StockType.LINK_BTC,
    StockType.XRP_BTC,
    StockType.ETH_BTC
];

export const chartColors: { [key in StockType]: string } = {
    [StockType.LINK_BTC]: '#ff9900',
    [StockType.TRX_BTC]: '#0043ce',
    [StockType.BTN_USD]: '#636366',
    [StockType.XRP_BTC]: '#DA291C',
    [StockType.ETH_BTC]: '#0F9D58'
};

export const chartLabels: { [key in StockType]: string } = {
    [StockType.LINK_BTC]: 'LINKBTC',
    [StockType.TRX_BTC]: 'TRXBTC',
    [StockType.BTN_USD]: 'BITCOIN',
    [StockType.XRP_BTC]: 'XRP',
    [StockType.ETH_BTC]: 'ETHEREUM'
};
