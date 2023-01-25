import { ISensor, NewSensor } from './sensor.model';

export const sampleWithRequiredData: ISensor = {
  id: 28460,
};

export const sampleWithPartialData: ISensor = {
  id: 59402,
  name: 'virtual action-items Yen',
  status: 'next Plastic Intuitive',
};

export const sampleWithFullData: ISensor = {
  id: 92486,
  name: 'value-added',
  status: 'teal Graphical Illinois',
};

export const sampleWithNewData: NewSensor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
