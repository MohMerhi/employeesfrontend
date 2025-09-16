import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeavingService } from '../../services/leaving-service';
import { EmployeeService } from '../../services/employee-service';
import { LeaveTypeService } from '../../services/leave-type-service';

@Component({
  selector: 'app-add-leave-modal-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-leave-modal-component.html',
  styleUrls: ['./add-leave-modal-component.css']
})
export class AddLeaveModalComponent implements OnInit {
  @Input() leave: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() leaveSaved = new EventEmitter<void>();

  leaveForm!: FormGroup;
  isEditMode = false;
  employees: any[] = [];
  leaveTypes: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private leavingService: LeavingService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    this.leaveForm = this.fb.group({
      id: [null],
      numberOfDays: [1, [Validators.required, Validators.min(1)]],
      startDate: [null, Validators.required],
      leaveTypeId: [null, Validators.required],
      employeeId: [null, Validators.required],
      note: ['']
    });

    if (this.leave) {
      this.isEditMode = true;
      this.leaveForm.patchValue(this.leave);
    }
  }

  loadDropdownData(): void {
    this.employeeService.getEmployees().subscribe(data => this.employees = data);
    this.leaveTypeService.getLeaveTypes().subscribe({
      next: (data: any[]) => this.leaveTypes = data,
      error: () => {
        console.warn("Could not fetch leave types. Using placeholder data.");
        this.leaveTypes = [ { id: 1, name: 'Annual Leave' }, { id: 2, name: 'Sick Leave' } ];
      }
    });
  }

  saveLeave(): void {
    this.errorMessage = null;
    if (this.leaveForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.leaveForm.markAllAsTouched();
      return;
    }

    const formValue = this.leaveForm.getRawValue();

    try {
      const dateParts = formValue.startDate.split('-');
      formValue.startDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch (e) {
      this.errorMessage = 'The start date is invalid.';
      return;
    }

    const saveOperation = this.isEditMode
      ? this.leavingService.updateLeaving(formValue.id, formValue)
      : this.leavingService.addLeaving(formValue);

    saveOperation.subscribe({
      next: () => {
        this.leaveSaved.emit();
        this.close();
      },
      error: (err: any) => {
        console.error('Error saving leave:', err);
        this.errorMessage = 'Failed to save the leave record. Please try again.';
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
