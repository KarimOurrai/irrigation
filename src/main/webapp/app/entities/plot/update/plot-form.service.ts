import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlot, NewPlot } from '../plot.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlot for edit and NewPlotFormGroupInput for create.
 */
type PlotFormGroupInput = IPlot | PartialWithRequiredKeyOf<NewPlot>;

type PlotFormDefaults = Pick<NewPlot, 'id'>;

type PlotFormGroupContent = {
  id: FormControl<IPlot['id'] | NewPlot['id']>;
  cultivatedArea: FormControl<IPlot['cultivatedArea']>;
  name: FormControl<IPlot['name']>;
  location: FormControl<IPlot['location']>;
  crop: FormControl<IPlot['crop']>;
  sensor: FormControl<IPlot['sensor']>;
};

export type PlotFormGroup = FormGroup<PlotFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlotFormService {
  createPlotFormGroup(plot: PlotFormGroupInput = { id: null }): PlotFormGroup {
    const plotRawValue = {
      ...this.getFormDefaults(),
      ...plot,
    };
    return new FormGroup<PlotFormGroupContent>({
      id: new FormControl(
        { value: plotRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cultivatedArea: new FormControl(plotRawValue.cultivatedArea),
      name: new FormControl(plotRawValue.name),
      location: new FormControl(plotRawValue.location),
      crop: new FormControl(plotRawValue.crop),
      sensor: new FormControl(plotRawValue.sensor),
    });
  }

  getPlot(form: PlotFormGroup): IPlot | NewPlot {
    return form.getRawValue() as IPlot | NewPlot;
  }

  resetForm(form: PlotFormGroup, plot: PlotFormGroupInput): void {
    const plotRawValue = { ...this.getFormDefaults(), ...plot };
    form.reset(
      {
        ...plotRawValue,
        id: { value: plotRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlotFormDefaults {
    return {
      id: null,
    };
  }
}
