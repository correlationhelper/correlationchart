import { Component } from '@angular/core';
import { ChartService } from './../../app/shared/services/chart/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  constructor(public chartService: ChartService) { }
}
