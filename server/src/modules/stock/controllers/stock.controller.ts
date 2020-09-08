import { Controller, Get, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';

import { StockInterval, StockType } from '../constants/stock.constants';
import { StockService } from '../services/stock.service';
import { IStockItem } from '../models/stock.models';

@Controller('stock')
export class StockController {

    constructor(
        private stockService: StockService
    ) {
    }

    @Get(':type')
    public getCharts(
        @Param('type') type: StockType,
        @Query('interval') interval: StockInterval
    ): Observable<Array<IStockItem>> {
        return this.stockService.getStockData(type, interval || StockInterval.DAY);
    }
}
