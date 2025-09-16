import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseClaimService } from '../../services/expense-claim-service';

@Component({
  selector: 'app-edit-expense-claim-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-expense-claim-modal-component.html',
})
export class EditExpenseClaimModalComponent {
  @Input() expenseClaim: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() claimSaved = new EventEmitter<void>();

  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private expenseClaimService: ExpenseClaimService
  ) {}

  private formatDateForApi(inputDate: string): string | null {
    if (!inputDate) return null;
    const parts = inputDate.split('-');
    if (parts.length !== 3) return inputDate; // Return original if not in yyyy-MM-dd format
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  updateStatus(newStatus: 'Approved' | 'Rejected'): void {
    this.errorMessage = null;
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const formattedDate = this.formatDateForApi(this.expenseClaim.date);
    if (!formattedDate) {
      this.errorMessage = 'The existing date on the claim is invalid.';
      this.isSubmitting = false;
      return;
    }

    const payload = {
      id: this.expenseClaim.id,
      date: formattedDate,
      employeeId: this.expenseClaim.employeeId,
      description: this.expenseClaim.description,
      status: newStatus
    };

    this.expenseClaimService.updateExpenseClaim(this.expenseClaim.id, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.claimSaved.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error updating expense claim status:', err);
        this.errorMessage = 'Failed to update the claim status. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
