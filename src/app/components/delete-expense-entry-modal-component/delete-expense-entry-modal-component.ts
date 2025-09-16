import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseClaimEntryService } from '../../services/expense-claim-entry-service';

@Component({
  selector: 'app-delete-expense-entry-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-expense-entry-modal-component.html',
})
export class DeleteExpenseEntryModalComponent {
  @Input() entry: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() entryDeleted = new EventEmitter<void>();

  errorMessage: string | null = null;
  isDeleting = false;

  constructor(private expenseClaimEntryService: ExpenseClaimEntryService) {}

  confirmDelete(): void {
    if (!this.entry) return;

    this.isDeleting = true;
    this.errorMessage = null;

    this.expenseClaimEntryService.deleteExpenseClaimEntry(this.entry.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.entryDeleted.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error deleting expense entry:', err);
        this.errorMessage = 'Failed to delete the entry. Please try again.';
        this.isDeleting = false;
      }
    });
  }

  cancel(): void {
    this.closeModal.emit();
  }

  close(): void {
    this.closeModal.emit();
  }
}
