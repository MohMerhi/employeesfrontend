import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpenseClaimService } from '../../services/expense-claim-service';
import { AddExpenseModalComponent } from '../add-expense-modal-component/add-expense-modal-component';
import { DeleteExpenseModalComponent } from '../delete-expense-modal-component/delete-expense-modal-component'; // Import Delete Modal
@Component({
  selector: 'app-expenses-component',
  standalone: true,
  imports: [CommonModule, RouterLink, AddExpenseModalComponent, DeleteExpenseModalComponent], // Add modals
  templateUrl: './expenses-component.html',
  styleUrl: './expenses-component.css'
})
export class ExpensesComponent implements OnInit {
  expenseClaims: any[] = [];
  paginatedExpenseClaims: any[] = [];
  errorMessage: string | null = null;
// Modal states
  isAddModalOpen = false;
  isDeleteModalOpen = false;
  expenseToDelete: any = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  constructor(private expenseClaimService: ExpenseClaimService) {}
  ngOnInit(): void {
    this.loadExpenseClaims();
  }
  loadExpenseClaims(): void {
    this.expenseClaimService.getExpenseClaims().subscribe({
      next: (data) => {
        this.expenseClaims = data;
        this.totalPages = Math.ceil(this.expenseClaims.length / this.pageSize);
        this.setPage(this.currentPage);
      },
      error: (err) => {
        console.error('Error fetching expense claims:', err);
        this.errorMessage = 'Failed to load expense claims. Please try again later.';
      }
    });
  }
  setPage(pageNumber: number): void {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > this.totalPages && this.totalPages > 0) pageNumber = this.totalPages;
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedExpenseClaims = this.expenseClaims.slice(startIndex, startIndex + this.pageSize);
  }
  goToNextPage(): void { this.setPage(this.currentPage + 1); }
  goToPreviousPage(): void { this.setPage(this.currentPage - 1); }
  openAddExpenseModal(): void { this.isAddModalOpen = true; }
  closeAddExpenseModal(): void { this.isAddModalOpen = false; }
  onExpenseSaved(): void {
    this.loadExpenseClaims();
    this.closeAddExpenseModal();
  }
  openDeleteModal(claim: any): void {
    this.expenseToDelete = claim;
    this.isDeleteModalOpen = true;
  }
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.expenseToDelete = null;
  }
  onExpenseDeleted(): void {
    if (this.paginatedExpenseClaims.length === 1 && this.currentPage > 1) {
      this.currentPage--;
    }
    this.loadExpenseClaims();
    this.closeDeleteModal();
  }
}
