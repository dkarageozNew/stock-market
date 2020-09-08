import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ChartComponent } from './components/chart/chart.component';
import { ApiService } from './services/api.service';

@NgModule({
    declarations: [
        DashboardComponent,
        ChartComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [
        ApiService
    ],
    exports: [
        DashboardComponent
    ]
})
export class FeatureModule {

}
