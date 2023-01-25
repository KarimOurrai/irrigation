export interface ISensor {
  id: number;
  name?: string | null;
  status?: string | null;
}

export type NewSensor = Omit<ISensor, 'id'> & { id: null };
