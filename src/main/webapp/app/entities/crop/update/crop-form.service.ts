import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICrop, NewCrop } from '../crop.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICrop for edit and NewCropFormGroupInput for create.
 */
type CropFormGroupInput = ICrop | PartialWithRequiredKeyOf<NewCrop>;

type CropFormDefaults = Pick<NewCrop, 'id'>;

type CropFormGroupContent = {
  id: FormControl<ICrop['id'] | NewCrop['id']>;
  type: FormControl<ICrop['type']>;
  waterAmount: FormControl<ICrop['waterAmount']>;
  duration: FormControl<ICrop['duration']>;
  area: FormControl<ICrop['area']>;
};

export type CropFormGroup = FormGroup<CropFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CropFormService {
  createCropFormGroup(crop: CropFormGroupInput = { id: null }): CropFormGroup {
    const cropRawValue = {
      ...this.getFormDefaults(),
      ...crop,
    };
    return new FormGroup<CropFormGroupContent>({
      id: new FormControl(
        { value: cropRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(cropRawValue.type, {
        validators: [Validators.required],
      }),
      waterAmount: new FormControl(cropRawValue.waterAmount),
      duration: new FormControl(cropRawValue.duration),
      area: new FormControl(cropRawValue.area),
    });
  }

  getCrop(form: CropFormGroup): ICrop | NewCrop {
    return form.getRawValue() as ICrop | NewCrop;
  }

  resetForm(form: CropFormGroup, crop: CropFormGroupInput): void {
    const cropRawValue = { ...this.getFormDefaults(), ...crop };
    form.reset(
      {
        ...cropRawValue,
        id: { value: cropRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CropFormDefaults {
    return {
      id: null,
    };
  }
}
