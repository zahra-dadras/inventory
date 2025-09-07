import { StoreroomTypeModel } from './storeroom-type.model';

export interface StoreroomModel {
  storeroomTitle: string;
  id?: number;
  storeroomCode: string;
  storeroomChairman: string;
  createDate: string | Date;
  maxTemperature: number | null;
  minTemperature: number | null;
  maxHumidity: number | null;
  minHumidity: number | null;
  storeroomType?: StoreroomTypeModel;
  storeroomTypeId: number;
  storeroomTypePersianTitle?: string | null;
}
