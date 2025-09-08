export interface StoreroomDocumentModel {
  id?: number;
  documentCode?: string;
  documentDate: Date | string;
  documentTitle: string;
  documentType: string;
  documentGroup: string;
  storeroomId: number;
  reciever: string;
  deliverer: string;
}
