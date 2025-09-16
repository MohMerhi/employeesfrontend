import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavingService {
  private apiUrl = 'http://localhost:8080/api/leavings';

  constructor(private http: HttpClient) {}

  getLeavings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLeavesByEmployee(employeeId: number, pageRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employee/${employeeId}`, pageRequest);
  }

  getLeavesByLeaveType(typeId: number, pageRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/leaveType/${typeId}`, pageRequest);
  }

  addLeaving(leaving: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-leaving`, leaving);
  }

  updateLeaving(id: number, partialLeaving: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/edit-leaving/${id}`, partialLeaving);
  }

  deleteLeaving(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-leaving/${id}`);
  }
}
