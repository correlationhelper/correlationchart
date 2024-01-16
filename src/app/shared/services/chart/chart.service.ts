import { Injectable } from '@angular/core';
import { CandleInterface } from './../../interfaces/candle.interface';
import { NavigatorInterface } from './../../interfaces/navigator.interface';
import { BackendService } from './../../services/backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  chartOptions: Object = {};

  constructor(public backendService: BackendService) { }

  getChartOptions() {
    //Ensure this.chartOptions has been setup and only runs once
    //getChartOptions is used in an Angular HTML attribute and can be called multiple times
    if (Object.keys(this.chartOptions).length ===0){
      this.setupChartOptions();
    }
    return this.chartOptions;
  }

  setupChartOptions(): void {
    let dataPoints: Array<CandleInterface> = new Array<CandleInterface>();
    let dataPoints2: Array<CandleInterface> = new Array<CandleInterface>();
    let dataPoints3: Array<NavigatorInterface> = new Array<NavigatorInterface>();
    this.backendService.createDataPoints(dataPoints, dataPoints2, dataPoints3);
    console.log(dataPoints3);


    let localChartOptions = {
      title: {
        text: "CanvasJS Angular StockChart"
      },
      theme: "light2",
      exportEnabled: true,
      zoomEnabled: true,
      legend: {
        verticalAlign: "top"
      },
      charts: [{
        toolTip:{
          shared: true,
          content: "{name}: ${y}"
        },
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: function(e: any) {
            return "";
          }
        },
        axisY: {
          prefix: "$",
          title: "Price"
        },
        data: [{
          showInLegend: true,
          name: 'symbol1',
          type: "candlestick",
          risingColor: "green",
          color: "red",
          yValueFormatString: "$#,###.##",
          dataPoints: dataPoints
        },
        {
          showInLegend: true,
          name: 'symbol2',
          yValueFormatString: "$#,###.##",
          type: "candlestick",
          dataPoints : dataPoints2
        }]
      }],
      navigator: {
        data: [{
          showInLegend: true,
          dataPoints: dataPoints3
        }],
        slider: {
          minimum: new Date("2018-07-01"),
          maximum: new Date("2019-06-30")
        }
      }
    };
    this.chartOptions = localChartOptions;
  }
 }
