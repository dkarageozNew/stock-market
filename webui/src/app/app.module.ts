import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FeatureModule } from './modules/feature/feature.module';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {url: '', options: {}};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FeatureModule,
        BrowserModule,
        HttpClientModule,
        SocketIoModule.forRoot(config)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
