import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StockInterval, StockType } from '../constants/charts.constants';
import { IStockItem } from '../models/chart.models';
import { Socket } from 'ngx-socket-io';

enum ApiUrls {
    Chart = '/v1/stock/:type'
}

@Injectable()
export class ApiService {

    constructor(
        private httpClient: HttpClient,
        private socket: Socket
    ) {}

    public getStockData(type: StockType, interval: StockInterval): Observable<Array<IStockItem>> {
        const url = ApiUrls.Chart.replace(':type', type);

        return this.httpClient.get<Array<IStockItem>>(url, {
            params: {interval}
        });
    }

    public subscribeToStock<T>(stoke: StockType, cb: (data: T) => void): void {
        this.socket.on(stoke, cb);
    }
}
