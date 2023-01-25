import dayjs from 'dayjs/esm';
import { IPlot } from 'app/entities/plot/plot.model';

export interface ITimeSlot {
  id: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  status?: dayjs.Dayjs | null;
  waterAmount?: number | null;
  plot?: Pick<IPlot, 'id'> | null;
}

export type NewTimeSlot = Omit<ITimeSlot, 'id'> & { id: null };
