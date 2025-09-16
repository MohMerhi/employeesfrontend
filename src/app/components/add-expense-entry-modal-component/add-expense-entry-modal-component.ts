import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseTypeService } from '../../services/expense-types-service';
import { ExpenseClaimEntryService } from '../../services/expense-claim-entry-service';

@Component({
  selector: 'app-add-expense-entry-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense-entry-modal-component.html',
})
export class AddExpenseEntryModalComponent implements OnInit {
  @Input() expenseClaimId!: number;
  @Input() entry: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() entrySaved = new EventEmitter<void>();

  entryForm!: FormGroup;
  expenseTypes: any[] = [];
  isEditMode = false;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private expenseTypeService: ExpenseTypeService,
    private expenseClaimEntryService: ExpenseClaimEntryService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.entry;
    this.loadExpenseTypes();

    this.entryForm = this.fb.group({
      id: [null],
      date: [null, Validators.required],
      expenseTypeId: [null, Validators.required],
      total: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

    if (this.isEditMode) {
      this.entryForm.patchValue(this.entry);
    }
  }

  loadExpenseTypes(): void {
    this.expenseTypeService.getExpenseTypes().subscribe({
      next: (data) => this.expenseTypes = data,
      error: (err) => console.error('Error fetching expense types', err)
    });
  }

  saveEntry(): void {
    this.errorMessage = null;
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = this.entryForm.getRawValue();
    const dateParts = formValue.date.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    const payload = {
      ...formValue,
      date: formattedDate,
      expenseClaimId: this.expenseClaimId
    };

    const saveOperation = this.isEditMode
      ? this.expenseClaimEntryService.updateExpenseClaimEntry(payload.id, payload)
      : this.expenseClaimEntryService.addExpenseClaimEntry(payload);

    saveOperation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.entrySaved.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error saving entry:', err);
        this.errorMessage = 'Failed to save the entry. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
