import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITimeSlot, NewTimeSlot } from '../time-slot.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimeSlot for edit and NewTimeSlotFormGroupInput for create.
 */
type TimeSlotFormGroupInput = ITimeSlot | PartialWithRequiredKeyOf<NewTimeSlot>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITimeSlot | NewTimeSlot> = Omit<T, 'startTime' | 'endTime' | 'status'> & {
  startTime?: string | null;
  endTime?: string | null;
  status?: string | null;
};

type TimeSlotFormRawValue = FormValueOf<ITimeSlot>;

type NewTimeSlotFormRawValue = FormValueOf<NewTimeSlot>;

type TimeSlotFormDefaults = Pick<NewTimeSlot, 'id' | 'startTime' | 'endTime' | 'status'>;

type TimeSlotFormGroupContent = {
  id: FormControl<TimeSlotFormRawValue['id'] | NewTimeSlot['id']>;
  startTime: FormControl<TimeSlotFormRawValue['startTime']>;
  endTime: FormControl<TimeSlotFormRawValue['endTime']>;
  status: FormControl<TimeSlotFormRawValue['status']>;
  waterAmount: FormControl<TimeSlotFormRawValue['waterAmount']>;
  plot: FormControl<TimeSlotFormRawValue['plot']>;
};

export type TimeSlotFormGroup = FormGroup<TimeSlotFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimeSlotFormService {
  createTimeSlotFormGroup(timeSlot: TimeSlotFormGroupInput = { id: null }): TimeSlotFormGroup {
    const timeSlotRawValue = this.convertTimeSlotToTimeSlotRawValue({
      ...this.getFormDefaults(),
      ...timeSlot,
    });
    return new FormGroup<TimeSlotFormGroupContent>({
      id: new FormControl(
        { value: timeSlotRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTime: new FormControl(timeSlotRawValue.startTime),
      endTime: new FormControl(timeSlotRawValue.endTime),
      status: new FormControl(timeSlotRawValue.status),
      waterAmount: new FormControl(timeSlotRawValue.waterAmount),
      plot: new FormControl(timeSlotRawValue.plot),
    });
  }

  getTimeSlot(form: TimeSlotFormGroup): ITimeSlot | NewTimeSlot {
    return this.convertTimeSlotRawValueToTimeSlot(form.getRawValue() as TimeSlotFormRawValue | NewTimeSlotFormRawValue);
  }

  resetForm(form: TimeSlotFormGroup, timeSlot: TimeSlotFormGroupInput): void {
    const timeSlotRawValue = this.convertTimeSlotToTimeSlotRawValue({ ...this.getFormDefaults(), ...timeSlot });
    form.reset(
      {
        ...timeSlotRawValue,
        id: { value: timeSlotRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimeSlotFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
      status: currentTime,
    };
  }

  private convertTimeSlotRawValueToTimeSlot(rawTimeSlot: TimeSlotFormRawValue | NewTimeSlotFormRawValue): ITimeSlot | NewTimeSlot {
    return {
      ...rawTimeSlot,
      startTime: dayjs(rawTimeSlot.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawTimeSlot.endTime, DATE_TIME_FORMAT),
      status: dayjs(rawTimeSlot.status, DATE_TIME_FORMAT),
    };
  }

  private convertTimeSlotToTimeSlotRawValue(
    timeSlot: ITimeSlot | (Partial<NewTimeSlot> & TimeSlotFormDefaults)
  ): TimeSlotFormRawValue | PartialWithRequiredKeyOf<NewTimeSlotFormRawValue> {
    return {
      ...timeSlot,
      startTime: timeSlot.startTime ? timeSlot.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: timeSlot.endTime ? timeSlot.endTime.format(DATE_TIME_FORMAT) : undefined,
      status: timeSlot.status ? timeSlot.status.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
