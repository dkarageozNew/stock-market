import { Module } from '@nestjs/common';

import { StockModule } from './modules/stock/stock.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from './modules/cache/cache.module';

@Module({
    imports: [
        CacheModule,
        ScheduleModule.forRoot(),
        StockModule
    ]
})
export class AppModule {
}
