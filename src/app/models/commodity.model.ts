export interface CommodityModel {
  id?: number;
  commodityPersianTitle: string | null;
  commodityEnglishTitle: string | null;
  commodityCode?: string | null;
  createDate: string | Date;
  commodityTypeId: number | null;
  measurementUnitId: number | null;
  description: string | null;
}
