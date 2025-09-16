import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseClaimEntryService {
  private apiUrl = 'http://localhost:8080/api/expenseClaimEntries';

  constructor(private http: HttpClient) {}

  addExpenseClaimEntry(entry: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-expenseClaimEntry`, entry);
  }

  updateExpenseClaimEntry(id: number, entry: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/edit-expenseClaimEntry/${id}`, entry);
  }

  deleteExpenseClaimEntry(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-expenseClaimEntry/${id}`);
  }
}
