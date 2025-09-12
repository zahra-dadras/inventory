import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeasurementUnitModel } from '../models/measurement-unit.model';

@Injectable({
  providedIn: 'root',
})
export class MeasurementUnitService {
  private apiUrl = 'http://localhost:5500/api/measurement-unit';

  constructor(private http: HttpClient) {}

  getMeasurementUnits(): Observable<MeasurementUnitModel[]> {
    return this.http.get<MeasurementUnitModel[]>(this.apiUrl);
  }

  getGenerateCodeMeasurementUnit(): Observable<{
    measurement_unit_code: string;
  }> {
    return this.http.get<{ measurement_unit_code: string }>(
      `${this.apiUrl}/generate-code`
    );
  }

  createMeasurementUnit(
    value: MeasurementUnitModel
  ): Observable<MeasurementUnitModel> {
    return this.http.post<MeasurementUnitModel>(this.apiUrl, value);
  }

  updateMeasurementUnit(
    id: number,
    data: MeasurementUnitModel
  ): Observable<MeasurementUnitModel> {
    return this.http.put<MeasurementUnitModel>(`${this.apiUrl}/${id}`, data);
  }

  deleteMeasurementUnit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
