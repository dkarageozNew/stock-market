import { HttpModule, Module } from '@nestjs/common';

import { StockController } from './controllers/stock.controller';
import { TasksService } from './services/tasks.service';
import { CacheService } from './services/cache.service';
import { StockService } from './services/stock.service';
import { StockSocketGateway } from './sockets/stock-socket.gateway';

@Module({
    controllers: [
        StockController
    ],
    providers: [
        StockService,
        TasksService,
        CacheService,

        StockSocketGateway
    ],
    imports: [
        HttpModule
    ]
})
export class StockModule {
}
