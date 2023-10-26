import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BackendComunicationService {
  private baseUrl: string=environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* All the HTTP methods */

  get(endPoint: string, token?: string): Observable<Object> {
    if(!token) return this.http.get(`${this.baseUrl}/${endPoint}`);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.get(`${this.baseUrl}/${endPoint}`, { headers: httpHeaders });
  }

  post(endPoint: string, body: Object, token?: string): Observable<Object> {
    if(!token) return this.http.post(`${this.baseUrl}/${endPoint}`, body);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.post(`${this.baseUrl}/${endPoint}`, { headers: httpHeaders });
  }

  put(endPoint: string, body: Object, token?: string): Observable<Object> {
    if(!token) return this.http.put(`${this.baseUrl}/${endPoint}`, body);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.put(`${this.baseUrl}/${endPoint}`, { headers: httpHeaders });
  }

  delete(endPoint: string, token?: string): Observable<Object> {
    if(!token) return this.http.delete(`${this.baseUrl}/${endPoint}`);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.delete(`${this.baseUrl}/${endPoint}`, { headers: httpHeaders });
  }

  patch(endPoint: string, body: Object, token?: string): Observable<Object> {
    if(!token) return this.http.patch(`${this.baseUrl}/${endPoint}`, body);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.patch(`${this.baseUrl}/${endPoint}`, { headers: httpHeaders });
  }
}
