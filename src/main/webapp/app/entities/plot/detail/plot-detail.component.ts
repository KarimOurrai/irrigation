import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlot } from '../plot.model';

@Component({
  selector: 'jhi-plot-detail',
  templateUrl: './plot-detail.component.html',
})
export class PlotDetailComponent implements OnInit {
  plot: IPlot | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plot }) => {
      this.plot = plot;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
