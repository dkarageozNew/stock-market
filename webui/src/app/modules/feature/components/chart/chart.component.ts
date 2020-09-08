import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { IStockItem } from '../../models/chart.models';
import { DestroyBaseComponent } from '../../../../shared/base/destroy-base.component';
import { StockInterval, StockType } from '../../constants/charts.constants';
import { ApiService } from '../../services/api.service';
import { IChartDataItem } from '../../../../shared/modules/charts/charts.models';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent extends DestroyBaseComponent implements OnInit {

    @Input()
    public stokeType!: StockType;

    @Input()
    public chartColor!: string;

    @Input()
    public chartLabel!: string;

    public interval: typeof StockInterval = StockInterval;

    public chartData: Array<IChartDataItem> = [];

    constructor(
        private apiService: ApiService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.loadChartData(StockInterval.DAY);

        this.apiService.subscribeToStock<Array<IStockItem>>(this.stokeType, (data: Array<IStockItem>) => {
            this.chartData = [...this.chartData.slice(data.length), ...data.map(this.parseStockItem)];
        });
    }

    public loadChartData(interval: StockInterval): void {
        this.apiService.getStockData(this.stokeType, interval)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((data: Array<IStockItem>) => {
                this.chartData = data.map(this.parseStockItem);
            }, (err: any & object) => {
                alert(err && err.message);
            })
        ;
    }

    private parseStockItem(item: IStockItem): IChartDataItem {
        return {
            y: item.value,
            x: new Date(item.timestamp * 1000)
        };
    }
}
