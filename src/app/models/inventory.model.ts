export interface InventoryModel {
  id?: number;
  commodityId: number;
  storeroomId: number;
  storeroomDocumentId: number | null;
  value: string;
}
