import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseClaimService {
  private apiUrl = 'http://localhost:8080/api/expenseClaims';

  constructor(private http: HttpClient) {}

  getExpenseClaims(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getExpenseClaimById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addFullExpenseClaim(expenseClaim: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-full-expense`, expenseClaim);
  }

  updateExpenseClaim(id: number, expenseClaim: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/edit-expenseClaim/${id}`, expenseClaim);
  }

  deleteExpenseClaim(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-expenseClaim/${id}`);
  }
}
