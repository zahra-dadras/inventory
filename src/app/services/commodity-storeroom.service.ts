import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface commodityStoreroomModel {
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

  getCommodityStoreroomByStoreroomId(storeroomId: number): Observable<
    {
      id: number;
      commodityId: number;
      storeroomId: number;
    }[]
  > {
    console.log(storeroomId);
    return this.http.get<
      {
        id: number;
        commodityId: number;
        storeroomId: number;
      }[]
    >(`${this.apiUrl}/commodity-list-by-storeroom-id/${storeroomId}`);
  }

  createCommodityStoreroom(
    commodityId: number,
    storeroomId: number
  ): Observable<any> {
    return this.http.post<any>(this.apiUrl, { commodityId, storeroomId });
  }

  updateCommodityStoreroom(
    id: number,
    commodityId: number,
    storeroomId: number
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${commodityId}`, {
      commodityId,
      storeroomId,
    });
  }

  deleteCommodityStoreroom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
