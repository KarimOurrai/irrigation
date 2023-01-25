import { ICrop, NewCrop } from './crop.model';

export const sampleWithRequiredData: ICrop = {
  id: 98338,
  type: 'Saint Cloned',
};

export const sampleWithPartialData: ICrop = {
  id: 99898,
  type: 'SCSI Market El',
  duration: 94925,
};

export const sampleWithFullData: ICrop = {
  id: 19591,
  type: 'Avon Mouse program',
  waterAmount: 92629,
  duration: 43882,
  area: 72332,
};

export const sampleWithNewData: NewCrop = {
  type: 'Unbranded Seychelles',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
