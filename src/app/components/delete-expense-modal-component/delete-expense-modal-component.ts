import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ExpenseClaimService } from '../../services/expense-claim-service';
import { ExpenseClaimEntryService } from '../../services/expense-claim-entry-service';

@Component({
  selector: 'app-delete-expense-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-expense-modal-component.html',
  styleUrls: ['./delete-expense-modal-component.css']
})
export class DeleteExpenseModalComponent {
  @Input() expenseClaim: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() expenseDeleted = new EventEmitter<void>();

  errorMessage: string | null = null;
  isDeleting = false;

  constructor(
    private expenseClaimService: ExpenseClaimService,
    private expenseClaimEntryService: ExpenseClaimEntryService
  ) {}

  confirmDelete(): void {
    if (!this.expenseClaim) return;

    this.isDeleting = true;
    this.errorMessage = null;
    this.expenseClaimService.getExpenseClaimById(this.expenseClaim.id).pipe(
      switchMap(fullClaim => {
        const entries = fullClaim.expenseClaimEntries || [];
        if (entries.length === 0) {
          return of(null);
        }
        const deleteObservables = entries.map((entry: any) =>
          this.expenseClaimEntryService.deleteExpenseClaimEntry(entry.id)
        );
        return forkJoin(deleteObservables);
      }),
      switchMap(() => this.expenseClaimService.deleteExpenseClaim(this.expenseClaim.id))
    ).subscribe({
      next: () => {
        this.isDeleting = false;
        this.expenseDeleted.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error deleting expense claim:', err);
        this.errorMessage = 'Failed to delete the expense claim. Please try again.';
        this.isDeleting = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  cancel(): void {
    this.closeModal.emit();
  }
}
