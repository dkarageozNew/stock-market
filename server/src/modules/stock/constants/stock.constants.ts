export enum StockType {
    BTC_USB = 'btcusd',
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

export const allStocks: Array<StockType> = [
    StockType.ETH_BTC,
    StockType.LINK_BTC,
    StockType.TRX_BTC,
    StockType.XRP_BTC,
    StockType.BTC_USB
];
