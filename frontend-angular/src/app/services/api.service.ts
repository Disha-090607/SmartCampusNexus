import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  login(payload: { email: string; password: string }) {
    return this.http.post<any>(`${this.base}/auth/login`, payload);
  }

  register(payload: { name: string; email: string; password: string; role: string }) {
    return this.http.post<any>(`${this.base}/auth/register`, payload);
  }

  dashboard() {
    return this.http.get<any>(`${this.base}/dashboard`);
  }

  notices() {
    return this.http.get<any[]>(`${this.base}/notices`);
  }

  complaints() {
    return this.http.get<any[]>(`${this.base}/complaints`);
  }

  publishResult(payload: any) {
    return this.http.post<any>(`${this.base}/results`, payload);
  }

  createNotice(payload: any) {
    return this.http.post<any>(`${this.base}/notices`, payload);
  }

  updateComplaint(id: string, payload: any) {
    return this.http.put<any>(`${this.base}/complaints/${id}`, payload);
  }

  generateTimetable(payload: any) {
    return this.http.post<any>(`${this.base}/timetables/generate`, payload);
  }
}
