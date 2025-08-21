import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  getVisitsByPet(petId: number): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.apiUrl}/pets/${petId}/visits`);
  }

  getVisit(id: number): Observable<Visit> {
    return this.http.get<Visit>(`${this.apiUrl}/visits/${id}`);
  }

  createVisit(petId: number, visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(`${this.apiUrl}/pets/${petId}/visits`, visit);
  }

  updateVisit(id: number, visit: Visit): Observable<Visit> {
    return this.http.put<Visit>(`${this.apiUrl}/visits/${id}`, visit);
  }

  deleteVisit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/visits/${id}`);
  }
}