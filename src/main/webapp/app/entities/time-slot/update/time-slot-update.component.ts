import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TimeSlotFormService, TimeSlotFormGroup } from './time-slot-form.service';
import { ITimeSlot } from '../time-slot.model';
import { TimeSlotService } from '../service/time-slot.service';
import { IPlot } from 'app/entities/plot/plot.model';
import { PlotService } from 'app/entities/plot/service/plot.service';

@Component({
  selector: 'jhi-time-slot-update',
  templateUrl: './time-slot-update.component.html',
})
export class TimeSlotUpdateComponent implements OnInit {
  isSaving = false;
  timeSlot: ITimeSlot | null = null;

  plotsSharedCollection: IPlot[] = [];

  editForm: TimeSlotFormGroup = this.timeSlotFormService.createTimeSlotFormGroup();

  constructor(
    protected timeSlotService: TimeSlotService,
    protected timeSlotFormService: TimeSlotFormService,
    protected plotService: PlotService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePlot = (o1: IPlot | null, o2: IPlot | null): boolean => this.plotService.comparePlot(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timeSlot }) => {
      this.timeSlot = timeSlot;
      if (timeSlot) {
        this.updateForm(timeSlot);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timeSlot = this.timeSlotFormService.getTimeSlot(this.editForm);
    if (timeSlot.id !== null) {
      this.subscribeToSaveResponse(this.timeSlotService.update(timeSlot));
    } else {
      this.subscribeToSaveResponse(this.timeSlotService.create(timeSlot));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimeSlot>>): void {
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

  protected updateForm(timeSlot: ITimeSlot): void {
    this.timeSlot = timeSlot;
    this.timeSlotFormService.resetForm(this.editForm, timeSlot);

    this.plotsSharedCollection = this.plotService.addPlotToCollectionIfMissing<IPlot>(
      this.plotsSharedCollection,
      timeSlot.plot,
      timeSlot.plot
    );
  }

  protected loadRelationshipsOptions(): void {
    this.plotService
      .query()
      .pipe(map((res: HttpResponse<IPlot[]>) => res.body ?? []))
      .pipe(map((plots: IPlot[]) => this.plotService.addPlotToCollectionIfMissing<IPlot>(plots, this.timeSlot?.plot, this.timeSlot?.plot)))
      .subscribe((plots: IPlot[]) => (this.plotsSharedCollection = plots));
  }
}
