import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html'
})
export class DonaComponent {

  @Input() titulo: string= 'Sin título';

  @Input('labels') public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input('data') public doughnutChartData: MultiDataSet = [
    [350, 450, 100]
  ];

  public colors: Color[] = [
    {backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];

}
