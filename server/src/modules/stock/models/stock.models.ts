import { StockType } from '../constants/stock.constants';

export interface IStockPriseApi {
    close: number;
    date: string;
}

export interface IStockApiResponse {
    priceData: Array<IStockPriseApi>;
}

export interface IStockItem {
    value: number,
    timestamp: number
}

export interface ICacheStock {
    type: StockType,
    data: Array<IStockItem>
}

export interface ICacheUpdateStock extends ICacheStock {
    updateData: Array<IStockItem>;
}
