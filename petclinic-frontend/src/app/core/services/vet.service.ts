import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vet } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VetService {
  private apiUrl = 'http://localhost:8080/api/vets';

  constructor(private http: HttpClient) {}

  getVets(): Observable<Vet[]> {
    return this.http.get<Vet[]>(this.apiUrl);
  }

  getVet(id: number): Observable<Vet> {
    return this.http.get<Vet>(`${this.apiUrl}/${id}`);
  }
}