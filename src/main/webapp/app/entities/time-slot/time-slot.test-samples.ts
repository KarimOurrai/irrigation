import dayjs from 'dayjs/esm';

import { ITimeSlot, NewTimeSlot } from './time-slot.model';

export const sampleWithRequiredData: ITimeSlot = {
  id: 5308,
};

export const sampleWithPartialData: ITimeSlot = {
  id: 1939,
  startTime: dayjs('2023-01-24T02:38'),
  endTime: dayjs('2023-01-24T03:15'),
};

export const sampleWithFullData: ITimeSlot = {
  id: 8500,
  startTime: dayjs('2023-01-24T13:32'),
  endTime: dayjs('2023-01-24T16:43'),
  status: dayjs('2023-01-24T03:25'),
  waterAmount: 56689,
};

export const sampleWithNewData: NewTimeSlot = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
