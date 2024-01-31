import { Injectable } from '@angular/core';
import { CandleInterface } from './../../interfaces/candle.interface';
import { BackendCandleInterface } from './../../interfaces/backend-candle.interface';
import { BackendRInterface } from './../../interfaces/backend-r.interface';
import { NavigatorInterface } from './../../interfaces/navigator.interface';
import { FOX } from './../../test/FOX';
import { FOXA } from './../../test/FOXA';
import { R } from './../../test/FOX-FOXA-R';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  rDict = {}
  constructor() { }

  parseStockResponseBackend(dataPoints: Array<CandleInterface>, data: Array<BackendCandleInterface>, rDataArray: Array<BackendRInterface>){
    if(data.length < 1) return;
    //TODO: Make this a function

    //Scenario 1: No R Data until 01-10
    //The data loop would be rDate[0] == data1[1]
    //rDate[0] = '2024-01-10'
    //data1[0] = '2024-01-11'

    //rDate[0] = '2024-01-11'
    //data2[0] = '2024-01-10'

    //01-10-2024 < 01-11-2024 is TRUE


    //Loop to find when rDate array and data array sync up on the date 'd' property

    let rDataOffset: number = 0;
    let rDateNumber: number = this.createDateFromArray(rDataArray[0]['d'].split("-")).getTime();
    let dataDateNumber: number = this.createDateFromArray(data[0]['d'].split("-")).getTime();
    if (rDateNumber < dataDateNumber) {
      //data[0] = '2024-01-11'
      //rDataArray[0] = '2024-01-10'
      //data[1] = '2024-01-10'
      //rDataArray[loopIDX + rDataOffset] == data[0]

      //Iterate until we find the right data date
      for(let dataIDX: number = 1; dataIDX < data.length; dataIDX++) {
        let localDateNumber: number = this.createDateFromArray(data[dataIDX]['d'].split("-")).getTime();
        if(localDateNumber == rDateNumber) {
          rDataOffset = dataIDX * -1;
          break;
        }
      }
    }
    //rDateNumber > dataDateNumber will never happen because you need data date to exist
    //to calculate R for that date, so if the date doesn't exist in stock data it will not exist in R

    console.log('rDataOffset is: ' + rDataOffset);

    //When rDataOffset = -1
    //R begins 01-17
    //Data1 Begins 01-18
    //Data2 Begins 01-17
    //When iterating over data1 we want to skip until rDataOffset = 0 then begin
    //placing R values

  let printNumber: number = 0;


    for (let backendCandleIDX: number = 0; backendCandleIDX < data.length; backendCandleIDX++) {
      let dateSplitYYYYMMDD: string[] = data[backendCandleIDX]['d'].split("-");
      let rData: BackendRInterface = rDataArray[backendCandleIDX];
      //data could be looping over a date that is not an rDataArray
      //Check size isn't > than rDataArray.
      //The loop for backendCandle is iterating over daily candles where it's most recent to oldest.
      //There is a chance the asset does not have current dates data, so we need to find
      //where the date data starts matching up and go from there.


      let newPoint = {
        x: new Date(
          parseInt(dateSplitYYYYMMDD[0]),
          parseInt(dateSplitYYYYMMDD[1])-1,
          parseInt(dateSplitYYYYMMDD[2])
        ),
        y: [
          parseFloat(data[backendCandleIDX][1]),
          parseFloat(data[backendCandleIDX][2]),
          parseFloat(data[backendCandleIDX][3]),
          parseFloat(data[backendCandleIDX][4])
        ],
        w:0
      }
      let wValue: number | string = '';
      if (rDataOffset > -1 && rDataOffset < rDataArray.length) {
        newPoint['w'] = rDataArray[rDataOffset][1]
      }
      rDataOffset++;

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
    this.parseStockResponseBackend(dataPoints, FOX, R);
    this.parseStockResponseBackend(dataPoints2, FOXA, R);
    this.parseRResponse(dataPoints3, R);

  }

  createDateFromArray(dateStrArray: string[]): Date {
    return new Date(
      parseInt(dateStrArray[0]),
      parseInt(dateStrArray[1]),
      parseInt(dateStrArray[2])
    )
  }
}
