import { NgModule } from '@angular/core';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
    declarations: [
        LineChartComponent
    ],
    exports: [
        LineChartComponent
    ]
})
export class ChartsModule {
}
