import { IPlot, NewPlot } from './plot.model';

export const sampleWithRequiredData: IPlot = {
  id: 67020,
};

export const sampleWithPartialData: IPlot = {
  id: 84457,
  name: 'Ireland Consultant Nauru',
};

export const sampleWithFullData: IPlot = {
  id: 73638,
  cultivatedArea: 12335,
  name: 'FTP Bedfordshire compressing',
  location: 'black deposit',
};

export const sampleWithNewData: NewPlot = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
