import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PlotFormService, PlotFormGroup } from './plot-form.service';
import { IPlot } from '../plot.model';
import { PlotService } from '../service/plot.service';
import { ICrop } from 'app/entities/crop/crop.model';
import { CropService } from 'app/entities/crop/service/crop.service';
import { ISensor } from 'app/entities/sensor/sensor.model';
import { SensorService } from 'app/entities/sensor/service/sensor.service';

@Component({
  selector: 'jhi-plot-update',
  templateUrl: './plot-update.component.html',
})
export class PlotUpdateComponent implements OnInit {
  isSaving = false;
  plot: IPlot | null = null;

  cropsSharedCollection: ICrop[] = [];
  sensorsSharedCollection: ISensor[] = [];

  editForm: PlotFormGroup = this.plotFormService.createPlotFormGroup();

  constructor(
    protected plotService: PlotService,
    protected plotFormService: PlotFormService,
    protected cropService: CropService,
    protected sensorService: SensorService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCrop = (o1: ICrop | null, o2: ICrop | null): boolean => this.cropService.compareCrop(o1, o2);

  compareSensor = (o1: ISensor | null, o2: ISensor | null): boolean => this.sensorService.compareSensor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plot }) => {
      this.plot = plot;
      if (plot) {
        this.updateForm(plot);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plot = this.plotFormService.getPlot(this.editForm);
    if (plot.id !== null) {
      this.subscribeToSaveResponse(this.plotService.update(plot));
    } else {
      this.subscribeToSaveResponse(this.plotService.create(plot));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlot>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(plot: IPlot): void {
    this.plot = plot;
    this.plotFormService.resetForm(this.editForm, plot);

    this.cropsSharedCollection = this.cropService.addCropToCollectionIfMissing<ICrop>(this.cropsSharedCollection, plot.crop);
    this.sensorsSharedCollection = this.sensorService.addSensorToCollectionIfMissing<ISensor>(this.sensorsSharedCollection, plot.sensor);
  }

  protected loadRelationshipsOptions(): void {
    this.cropService
      .query()
      .pipe(map((res: HttpResponse<ICrop[]>) => res.body ?? []))
      .pipe(map((crops: ICrop[]) => this.cropService.addCropToCollectionIfMissing<ICrop>(crops, this.plot?.crop)))
      .subscribe((crops: ICrop[]) => (this.cropsSharedCollection = crops));

    this.sensorService
      .query()
      .pipe(map((res: HttpResponse<ISensor[]>) => res.body ?? []))
      .pipe(map((sensors: ISensor[]) => this.sensorService.addSensorToCollectionIfMissing<ISensor>(sensors, this.plot?.sensor)))
      .subscribe((sensors: ISensor[]) => (this.sensorsSharedCollection = sensors));
  }
}
