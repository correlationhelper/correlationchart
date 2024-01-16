import { Injectable } from '@angular/core';
import { CandleInterface } from './../../interfaces/candle.interface';
import { BackendCandleInterface } from './../../interfaces/backend-candle.interface';
import { BackendRInterface } from './../../interfaces/backend-r.interface';
import { NavigatorInterface } from './../../interfaces/navigator.interface';
import { FOX } from './../../test/FOX';
import { CHK } from './../../test/CHK';
import { R } from './../../test/R';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  parseRResponseBackend() {

  }

  parseStockResponseBackend(dataPoints: Array<CandleInterface>, data: Array<BackendCandleInterface>){
    for (let backendCandleIDX: number = 0; backendCandleIDX < data.length; backendCandleIDX++) {
      let dateSplitYYYYMMDD: string[] = data[backendCandleIDX]['d'].split("-");
      let newPoint = {
        x: new Date(
          parseInt(dateSplitYYYYMMDD[0]),
          parseInt(dateSplitYYYYMMDD[1]),
          parseInt(dateSplitYYYYMMDD[2])
        ),
        y: [
          parseFloat(data[backendCandleIDX][1]),
          parseFloat(data[backendCandleIDX][2]),
          parseFloat(data[backendCandleIDX][3]),
          parseFloat(data[backendCandleIDX][4])
        ]
      }
      dataPoints.push(newPoint);
    }
  }

  parseRResponse(dataPoints: Array<NavigatorInterface>, data: Array<BackendRInterface>){
    for (let backendCandleIDX: number = 0; backendCandleIDX < data.length; backendCandleIDX++) {
      let dateSplitYYYYMMDD: string[] = data[backendCandleIDX]['d'].split("-");
      let newPoint = {
        x: new Date(
          parseInt(dateSplitYYYYMMDD[0]),
          parseInt(dateSplitYYYYMMDD[1]),
          parseInt(dateSplitYYYYMMDD[2])
        ),
        y: data[backendCandleIDX][1]
      }
      dataPoints.push(newPoint);
    }
  }

  createDataPoints(dataPoints: Array<CandleInterface>, dataPoints2: Array<CandleInterface>, dataPoints3: Array<NavigatorInterface>) {
    this.parseStockResponseBackend(dataPoints, FOX);
    this.parseStockResponseBackend(dataPoints2, CHK);
    this.parseRResponse(dataPoints3, R);

    /*this.testDataPoints(dataPoints);
    let thisLocal = this;
    $.ajax({
      url: 'https://canvasjs.com/data/gallery/javascript/netflix-stock-price.csv',
      type: 'GET',
      async: false,
      success: function (response) {
        thisLocal.parseResponse(dataPoints, response);
      }
    });*/
  }
}
