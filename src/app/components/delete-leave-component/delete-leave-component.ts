import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeavingService } from '../../services/leaving-service';

@Component({
  selector: 'app-delete-leave-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-leave-component.html',
  styleUrls: ['./delete-leave-component.css']
})
export class DeleteLeaveComponent {
  @Input() leave: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() leaveDeleted = new EventEmitter<void>();

  errorMessage: string | null = null;
  isDeleting = false;

  constructor(private leavingService: LeavingService) {}

  confirmDelete(): void {
    if (!this.leave) return;

    this.isDeleting = true;
    this.errorMessage = null;

    this.leavingService.deleteLeaving(this.leave.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.leaveDeleted.emit();
      },
      error: (err) => {
        console.error('Error deleting leave:', err);
        this.errorMessage = 'Failed to delete the leave record. Please try again later.';
        this.isDeleting = false;
      }
    });
  }

  cancel(): void {
    this.closeModal.emit();
  }
}
