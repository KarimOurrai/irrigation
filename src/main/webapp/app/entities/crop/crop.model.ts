export interface ICrop {
  id: number;
  type?: string | null;
  waterAmount?: number | null;
  duration?: number | null;
  area?: number | null;
}

export type NewCrop = Omit<ICrop, 'id'> & { id: null };
