import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private apiUrl = 'http://localhost:8080/api/leaveTypes'; // Assuming this is your endpoint

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
