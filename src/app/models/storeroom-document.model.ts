export interface StoreroomDocumentModel {
  id?: number;
  documentCode?: string;
  documentDate: Date | string;
  documentTitle: string;
  documentType: string;
  storeroomId: number;
  reciever: string;
  deliverer: string;
}
