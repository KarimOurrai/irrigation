import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CropFormService, CropFormGroup } from './crop-form.service';
import { ICrop } from '../crop.model';
import { CropService } from '../service/crop.service';

@Component({
  selector: 'jhi-crop-update',
  templateUrl: './crop-update.component.html',
})
export class CropUpdateComponent implements OnInit {
  isSaving = false;
  crop: ICrop | null = null;

  editForm: CropFormGroup = this.cropFormService.createCropFormGroup();

  constructor(protected cropService: CropService, protected cropFormService: CropFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crop }) => {
      this.crop = crop;
      if (crop) {
        this.updateForm(crop);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const crop = this.cropFormService.getCrop(this.editForm);
    if (crop.id !== null) {
      this.subscribeToSaveResponse(this.cropService.update(crop));
    } else {
      this.subscribeToSaveResponse(this.cropService.create(crop));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICrop>>): void {
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

  protected updateForm(crop: ICrop): void {
    this.crop = crop;
    this.cropFormService.resetForm(this.editForm, crop);
  }
}
