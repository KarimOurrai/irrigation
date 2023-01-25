import { ICrop } from 'app/entities/crop/crop.model';
import { ISensor } from 'app/entities/sensor/sensor.model';

export interface IPlot {
  id: number;
  cultivatedArea?: number | null;
  name?: string | null;
  location?: string | null;
  crop?: Pick<ICrop, 'id'> | null;
  sensor?: Pick<ISensor, 'id'> | null;
}

export type NewPlot = Omit<IPlot, 'id'> & { id: null };
