import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { forkJoin, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { CacheService } from './cache.service';
import { allStocks, StockType } from '../constants/stock.constants';
import { StockService } from './stock.service';
import { ICacheStock, ICacheUpdateStock, IStockItem } from '../models/stock.models';
import { StockSocketGateway } from '../sockets/stock-socket.gateway';

@Injectable()
export class TasksService implements OnModuleInit, OnModuleDestroy {

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private stockCacheService: CacheService,
        private stockService: StockService,
        private stockGateway: StockSocketGateway
    ) {
    }

    public onModuleInit(): void {
        this.stackLoadTask();
    }

    public onModuleDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    public handleCron(): void {
        this.stackLoadTask();
    }

    private stackLoadTask(): void {
        const cacheRequests = forkJoin(
            allStocks.map((type: StockType) => (
                this.stockCacheService.getFromCache(type)
                    .pipe(
                        map((data: Array<IStockItem>) => ({type, data}))
                    )
            ))
        );

        const stockRequests = (cache: Array<ICacheStock>): Observable<Array<ICacheUpdateStock>> => {
            return forkJoin(
                cache.map(({type, data: cacheData}: ICacheStock) => {
                    const isCacheExist = !!cacheData.length;

                    const parseStockData = (updateData: Array<IStockItem>) => ({
                        type,
                        updateData,
                        data: isCacheExist
                            ? cacheData.slice(updateData.length).concat(updateData)
                            : updateData
                    });

                    return this.stockService.loadStockData(type, isCacheExist)
                        .pipe(
                            map(parseStockData)
                        )
                    ;
                })
            )
        };

        const updateCache = (data: Array<ICacheUpdateStock>): Observable<Array<ICacheUpdateStock>> => (
            forkJoin(
                data.map((item: ICacheUpdateStock) => (
                    this.stockCacheService.save(item.type, item.data).pipe(map(() => item))
                ))
            )
        );

        const emitNewStockData = (data: Array<ICacheUpdateStock>): void => {
            data.forEach(({type, updateData}: ICacheUpdateStock) => {
                this.stockGateway.sendMessage(type, updateData);
            })
        };

        cacheRequests
            .pipe(
                switchMap((cache: Array<ICacheStock>) => stockRequests(cache)),
                switchMap((newData: Array<ICacheUpdateStock>) => updateCache(newData)),
                tap((newData: Array<ICacheUpdateStock>) => emitNewStockData(newData)),
                catchError((err: { message: string }) => throwError(err.message || err)),
                takeUntil(this.destroy$)
            ).subscribe()
        ;
    }
}
