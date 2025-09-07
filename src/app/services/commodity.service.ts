import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommodityModel } from '../models/commodity.model';

@Injectable({
  providedIn: 'root',
})
export class CommodityService {
  private apiUrl = 'http://localhost:5500/api/commodity';

  constructor(private http: HttpClient) {}

  getCommodityList(): Observable<CommodityModel[]> {
    return this.http.get<CommodityModel[]>(this.apiUrl);
  }

  getCommodityById(id: number): Observable<CommodityModel> {
    return this.http.get<CommodityModel>(`${this.apiUrl}/${id}`);
  }

  createCommodity(value: CommodityModel): Observable<CommodityModel> {
    return this.http.post<CommodityModel>(this.apiUrl, value);
  }

  updateCommodity(
    id: number,
    value: CommodityModel
  ): Observable<CommodityModel> {
    return this.http.put<CommodityModel>(`${this.apiUrl}/${id}`, value);
  }

  deleteStoreroom(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
  generateCodeCommodity(): Observable<{ commodityCode: string }> {
    return this.http.get<{ commodityCode: string }>(
      `${this.apiUrl}/generate-code`
    );
  }
}
