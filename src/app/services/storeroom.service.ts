import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreroomModel } from '../models/storeroom.model';
import { StoreroomTypeModel } from '../models/storeroom-type.model';

@Injectable({
  providedIn: 'root',
})
export class StoreroomService {
  private apiUrl = 'http://localhost:5500/api/storeroom';

  constructor(private http: HttpClient) {}

  getStoreroomList(): Observable<StoreroomModel[]> {
    return this.http.get<StoreroomModel[]>(this.apiUrl);
  }

  getStoreroomById(id: number): Observable<StoreroomModel> {
    return this.http.get<StoreroomModel>(`${this.apiUrl}/${id}`);
  }

  getStoreroomTypeList(): Observable<StoreroomTypeModel[]> {
    return this.http.get<StoreroomTypeModel[]>(
      `${this.apiUrl}/storeroom-type-list`
    );
  }

  getStoreroomTypeById(id: number): Observable<StoreroomTypeModel> {
    return this.http.get<StoreroomTypeModel>(
      `${this.apiUrl}/storeroom-type-list/${id}`
    );
  }

  getGenerateCodeStoreroom(): Observable<{ storeroomCode: string }> {
    return this.http.get<{ storeroomCode: string }>(
      `${this.apiUrl}/generate-code`
    );
  }

  createStoreroom(value: StoreroomModel): Observable<StoreroomModel> {
    return this.http.post<StoreroomModel>(this.apiUrl, value);
  }

  updateStoreroom(
    id: number,
    data: StoreroomModel
  ): Observable<StoreroomModel> {
    return this.http.put<StoreroomModel>(`${this.apiUrl}/${id}`, data);
  }

  deleteStoreroom(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}
