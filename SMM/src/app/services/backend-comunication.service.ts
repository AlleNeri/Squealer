import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BackendComunicationService {
  private readonly baseUrl: string=environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* Url composition */

  at(endPoint: string): string {
    return `${this.baseUrl}/${endPoint}`;
  }

  /* All the HTTP methods */

  get(endPoint: string, token?: string): Observable<Object> {
    if(!token) return this.http.get(this.at(endPoint));
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.get(this.at(endPoint), { headers: httpHeaders });
  }

  post(endPoint: string, body: Object, token?: string): Observable<Object> {
    if(!token) return this.http.post(this.at(endPoint), body);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.post(this.at(endPoint), body, { headers: httpHeaders });
  }

  put(endPoint: string, body: Object, token?: string): Observable<Object> {
    if(!token) return this.http.put(this.at(endPoint), body);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.put(this.at(endPoint), body, { headers: httpHeaders });
  }

  delete(endPoint: string, token?: string): Observable<Object> {
    if(!token) return this.http.delete(this.at(endPoint));
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.delete(this.at(endPoint), { headers: httpHeaders });
  }

  patch(endPoint: string, body: Object, token?: string): Observable<Object> {
    if(!token) return this.http.patch(this.at(endPoint), body);
    const httpHeaders: HttpHeaders = new HttpHeaders({ Authorization: token });
    return this.http.patch(this.at(endPoint), body, { headers: httpHeaders });
  }
}
