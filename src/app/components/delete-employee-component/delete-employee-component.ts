import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee-service';

@Component({
  selector: 'app-delete-employee-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-employee-component.html',
  styleUrls: ['./delete-employee-component.css']
})
export class DeleteEmployeeComponent {
  @Input() employee: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() employeeDeleted = new EventEmitter<void>();

  errorMessage: string | null = null;
  isDeleting = false;

  constructor(private employeeService: EmployeeService) {}

  confirmDelete(): void {
    if (!this.employee) return;

    this.isDeleting = true;
    this.errorMessage = null;

    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.employeeDeleted.emit();
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.errorMessage = 'Failed to delete the employee. Please try again later.';
        this.isDeleting = false;
      }
    });
  }

  cancel(): void {
    this.closeModal.emit();
  }
}
