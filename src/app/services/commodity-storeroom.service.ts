import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryModel } from '../models/inventory.model';

export interface commodityStoreroomModel {
  id: number;
  commodityId: number;
  storeroomId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CommodityStoreroomService {
  private apiUrl = 'http://localhost:5500/api/commodity-storeroom';

  constructor(private http: HttpClient) {}

  getCommodityStoreroomList(): Observable<
    {
      id: number;
      commodityId: number;
      storeroomId: number;
    }[]
  > {
    return this.http.get<
      {
        id: number;
        commodityId: number;
        storeroomId: number;
      }[]
    >(this.apiUrl);
  }

  getCommodityStoreroomByCommodityId(commodityId: number): Observable<
    {
      id: number;
      commodityId: number;
      storeroomId: number;
    }[]
  > {
    return this.http.get<
      {
        id: number;
        commodityId: number;
        storeroomId: number;
      }[]
    >(`${this.apiUrl}/${commodityId}`);
  }

  getReports(
    commodityId?: number,
    storeroomId?: number
  ): Observable<commodityStoreroomModel[]> {
    let url = `${this.apiUrl}/report`;

    // پارامترها رو داینامیک اضافه می‌کنیم
    const params: string[] = [];
    if (commodityId) params.push(`commodityId=${commodityId}`);
    if (storeroomId) params.push(`storeroomId=${storeroomId}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<commodityStoreroomModel[]>(url);
  }

  getCommodityStoreroomByStoreroomId(
    storeroomId: number
  ): Observable<InventoryModel[]> {
    console.log(storeroomId);
    return this.http.get<InventoryModel[]>(
      `${this.apiUrl}/commodity-list-by-storeroom-id/${storeroomId}`
    );
  }

  createCommodityStoreroom(value: InventoryModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, value);
  }

  updateCommodityStoreroom(id: number, value: InventoryModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${value.commodityId}`, value);
  }

  deleteCommodityStoreroom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
