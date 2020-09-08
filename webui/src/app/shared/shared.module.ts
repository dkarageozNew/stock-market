import { NgModule } from '@angular/core';
import { ChartsModule } from './modules/charts/charts.module';
import { ButtonsModule } from './modules/buttons/buttons.module';

@NgModule({
    exports: [ChartsModule, ButtonsModule]
})
export class SharedModule {
}
