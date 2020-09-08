import { Component } from '@angular/core';
import { StockType, stockCharts, chartColors, chartLabels } from '../../constants/charts.constants';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    public chartEvents: Array<StockType> = stockCharts;

    public chartColors: { [key in StockType]: string } = chartColors;

    public chartLabels: { [key in StockType]: string } = chartLabels;

}
