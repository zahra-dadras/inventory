import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommodityTypeModel } from '../models/commodity-type.model';

@Injectable({
  providedIn: 'root',
})
export class CommodityTypeService {
  private apiUrl = 'http://localhost:5500/api/commodity-type';

  constructor(private http: HttpClient) {}

  getCommodityTypes(): Observable<CommodityTypeModel[]> {
    return this.http.get<CommodityTypeModel[]>(this.apiUrl);
  }

  getGenerateCodingCommodityType(): Observable<{ commodity_code: string }> {
    return this.http.get<{ commodity_code: string }>(
      `${this.apiUrl}/generate-coding`
    );
  }

  createCommodityType(Commodity: CommodityTypeModel): Observable<any> {
    return this.http.post<CommodityTypeModel>(this.apiUrl, Commodity);
  }

  updateCommodityType(id: number, data: CommodityTypeModel): Observable<any> {
    return this.http.put<CommodityTypeModel>(`${this.apiUrl}/${id}`, data);
  }

  deleteCommodityType(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}
