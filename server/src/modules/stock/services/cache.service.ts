import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { allStocks, StockType } from '../constants/stock.constants';
import { IStockItem } from '../models/stock.models';
import { environment } from '../../../environment';

@Injectable()
export class CacheService implements OnModuleInit {

    constructor(
        private redisService: RedisService
    ) {
    }

    public onModuleInit(): void {
        if (environment.NODE_ENV !== 'production') {
            this.getClient().del(...allStocks.map((item) => item.toLowerCase()));
        }
    }

    public getFromCache(symbol: StockType): Observable<Array<IStockItem>> {
        return from(this.getClient().get(symbol.toLowerCase()))
            .pipe(
                map((data: string | null) => data ? JSON.parse(data) : [])
            )
            ;
    }

    public save(symbol: StockType, data: Array<IStockItem>): Observable<'OK'> {
        return from(
            this.getClient().set(symbol.toLowerCase(), JSON.stringify(data), 'EX', 60 * 60 * 24)
        );
    }

    private getClient(): Redis {
        return this.redisService.getClient();
    }
}
