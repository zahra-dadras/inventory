import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = 'http://localhost:5500/api/export';

  constructor(private http: HttpClient) { }

  exportToExcel(data: any[], fileName: string, columns: any[]) {
    return this.http.post(
      `${this.apiUrl}/excel`,
      { data, fileName, columns, options: { rtl: true } },
      { responseType: 'blob' }
    );
  }

  exportToPDF(data: any[], fileName: string, columns: any[]) {
    return this.http.post(
      `${this.apiUrl}/pdf`,
      { data, fileName, columns, options: { rtl: true } },
      { responseType: 'blob' }
    );
  }
}
