import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SensorFormService, SensorFormGroup } from './sensor-form.service';
import { ISensor } from '../sensor.model';
import { SensorService } from '../service/sensor.service';

@Component({
  selector: 'jhi-sensor-update',
  templateUrl: './sensor-update.component.html',
})
export class SensorUpdateComponent implements OnInit {
  isSaving = false;
  sensor: ISensor | null = null;

  editForm: SensorFormGroup = this.sensorFormService.createSensorFormGroup();

  constructor(
    protected sensorService: SensorService,
    protected sensorFormService: SensorFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sensor }) => {
      this.sensor = sensor;
      if (sensor) {
        this.updateForm(sensor);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sensor = this.sensorFormService.getSensor(this.editForm);
    if (sensor.id !== null) {
      this.subscribeToSaveResponse(this.sensorService.update(sensor));
    } else {
      this.subscribeToSaveResponse(this.sensorService.create(sensor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISensor>>): void {
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

  protected updateForm(sensor: ISensor): void {
    this.sensor = sensor;
    this.sensorFormService.resetForm(this.editForm, sensor);
  }
}
