import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BackendService } from './shared/services/backend/backend.service'
import { ChartService } from './shared/services/chart/chart.service'

import { CanvasJSAngularStockChartsModule } from '@canvasjs/angular-stockcharts';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CanvasJSAngularStockChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
