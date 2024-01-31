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

  getChartOptions(): any {
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

    let localChartOptions = {
      title: {
        text: "CanvasJS Angular StockChart"
      },
      theme: "light2",
      exportEnabled: true,
      legend: {
        verticalAlign: "top"
      },
      charts: [{
        zoomEnabled: true,
        toolTip:{
          shared: true,
          contentFormatter: function(e: any){
            var monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];

            var thisDate = new Date(e.entries[0].dataPoint.x);
            var dateString = monthNames[thisDate.getUTCMonth()] +" "+ thisDate.getUTCDate() + ", " + thisDate.getUTCFullYear();
            var ttDateString = "Date: " + dateString + "<br/>"
            var loopString = ttDateString;

            var thisDate = new Date(e.entries[0].dataPoint.x);
            var monthNumber = (thisDate.getUTCMonth() + 1);
            var monthString = "";
            var dateNumber = thisDate.getUTCDate();
            var dateString = "";
            if (monthNumber < 10){
              monthString = "0" + monthNumber;
            } else {
              monthString = monthNumber.toString();
            }
            if (dateNumber < 10){
              dateString = "0" + dateNumber;
            } else {
              dateString = dateNumber.toString();
            }
            var dateFullString = thisDate.getUTCFullYear() + "-" + monthString + "-" + dateString

            for (var i = 0; i < e.entries.length; i++){
              var symbolData = e.entries[i];
              //Open, high, low, close
              var open = e.entries[i].dataPoint.y[0]
              var close = e.entries[i].dataPoint.y[3]
              var pl = (close - open).toFixed(2);

              var plPercentOverPeriod = 0;
              if(e.entries[i].dataPoint.hasOwnProperty('w')) {
                plPercentOverPeriod = e.entries[i].dataPoint.w;
              }

              var temp = e.entries[i].dataSeries.name + "<br/>";
              loopString = loopString.concat(temp);

              //Loss % = Loss/Cost Price × 100.
              //Cost Price is the original cost before the loss. So Open is Cost Price
              var plPercent = (Number.parseFloat(pl) / open) * 100;
              temp = "P/L % Over Correlation Period: " + plPercentOverPeriod.toString() + "%<br/>";
              loopString = loopString.concat(temp);
              temp = "Profit/Loss: $" + pl.toString() + " Percent: " + plPercent.toFixed(2) + "%<br/>";
              loopString = loopString.concat(temp);
            }

            return loopString;
          }
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
