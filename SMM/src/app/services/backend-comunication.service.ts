import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendComunicationService {
  private baseUrl: string='http://localhost:3000';

  constructor(private http: HttpClient) {}

  get(endPoint: string): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${endPoint}`);
  }

  post(endPoint: string, body: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/${endPoint}`, body);
  }

  put(endPoint: string, body: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${endPoint}`, body);
  }

  delete(endPoint: string): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/${endPoint}`);
  }

  patch(endPoint: string, body: Object): Observable<Object> {
    return this.http.patch(`${this.baseUrl}/${endPoint}`, body);
  }
}
