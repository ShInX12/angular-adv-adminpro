import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [
    './progress.component.css'
  ]
})
export class ProgressComponent {

  progreso1: number = 25;
  progreso2: number = 55;

  get getPorcentaje1(): string {
    return `${this.progreso1}%`
  }

  get getPorcentaje2(): string {
    return `${this.progreso2}%`
  }
  
}
