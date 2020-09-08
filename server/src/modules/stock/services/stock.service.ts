import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StockInterval, StockType } from '../constants/stock.constants';
import { IStockApiResponse, IStockItem, IStockPriseApi } from '../models/stock.models';
import { CacheService } from './cache.service';
import { environment } from '../../../environment';

@Injectable()
export class StockService {

    constructor(
        private cacheService: CacheService,
        private httpClient: HttpService
    ) {
    }

    public getStockData(symbol: StockType, interval: StockInterval): Observable<Array<IStockItem>> {
        const sliceDate = (data: Array<IStockItem>): Array<IStockItem> => {
            if (!data.length || interval === StockInterval.DAY) {
                return data;
            }

            const items = interval === StockInterval.TWELVE_HOURS && Math.floor(data.length / 2)
                || interval === StockInterval.SIX_HOURS && Math.floor(data.length / 4)
                || interval === StockInterval.ONE_HOUR && Math.floor(data.length / 24)
            ;

            return data.slice(-items);
        };

        return from(this.cacheService.getFromCache(symbol))
            .pipe(
                map((cacheData: Array<IStockItem>) => sliceDate(cacheData))
            )
            ;
    }

    public loadStockData(tickers: StockType, lastNewData?: boolean): Observable<Array<IStockItem>> {
        const lastDay = new Date().getTime() - 1000 * 60 * 60 * 24;
        const last5Min = new Date().getTime() - 1000 * 60 * 5;
        const startDate = new Date(lastNewData ? last5Min : lastDay).toISOString();

        const params = {
            token: environment.API_TOKEN,
            tickers,
            resampleFreq: '5min',
            startDate
        };

        return this.httpClient.get<[IStockApiResponse]>(environment.STOCK_API_URL, {params})
            .pipe(
                map((response: AxiosResponse<[IStockApiResponse]>) => {
                    const data = response.data[0];

                    return data && data.priceData
                        ? data.priceData.map<IStockItem>((item: IStockPriseApi) => ({
                            value: item.close,
                            timestamp: new Date(item.date).getTime() / 1000
                        }))
                        : []
                        ;
                })
            )
            ;
    }
}
