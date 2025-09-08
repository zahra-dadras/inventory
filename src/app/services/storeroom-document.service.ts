import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreroomDocumentModel } from '../models/storeroom-document.model';

@Injectable({
  providedIn: 'root',
})
export class StoreroomDocumentService {
  private apiUrl = 'http://localhost:5500/api/storeroom-document';
  constructor(private http: HttpClient) {}

  getStoreroomDocumentList(): Observable<StoreroomDocumentModel[]> {
    return this.http.get<StoreroomDocumentModel[]>(this.apiUrl);
  }

  getStoreroomDocumentyById(id: number): Observable<StoreroomDocumentModel> {
    return this.http.get<StoreroomDocumentModel>(`${this.apiUrl}/${id}`);
  }

  createStoreroomDocument(
    value: StoreroomDocumentModel
  ): Observable<StoreroomDocumentModel> {
    return this.http.post<StoreroomDocumentModel>(this.apiUrl, value);
  }

  updateStoreroomDocument(
    id: number,
    value: StoreroomDocumentModel
  ): Observable<StoreroomDocumentModel> {
    return this.http.put<StoreroomDocumentModel>(`${this.apiUrl}/${id}`, value);
  }

  deleteStoreroomDocument(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
  generateCodeStoreroomDocument(): Observable<{
    storeroomDocumentCode: string;
  }> {
    return this.http.get<{ storeroomDocumentCode: string }>(
      `${this.apiUrl}/generate-code`
    );
  }
}
