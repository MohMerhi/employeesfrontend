import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee-service';
import { ExpenseTypeService } from '../../services/expense-types-service';
import { ExpenseClaimService } from '../../services/expense-claim-service';
import { ExpenseClaimEntryService } from '../../services/expense-claim-entry-service';

@Component({
  selector: 'app-edit-expense-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-expense-modal-component.html',
  styleUrls: ['./edit-expense-modal-component.css']
})
export class EditExpenseModalComponent implements OnInit {
  @Input() expenseClaim: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() expenseSaved = new EventEmitter<void>();

  expenseForm!: FormGroup;
  private initialEntryIds = new Set<number>();

  employees: any[] = [];
  expenseTypes: any[] = [];
  statuses: string[] = ['Pending', 'Approved', 'Rejected'];
  errorMessage: string | null = null;
  isSaving = false;

  constructor(
    private employeeService: EmployeeService,
    private expenseTypeService: ExpenseTypeService,
    private expenseClaimService: ExpenseClaimService,
    private expenseClaimEntryService: ExpenseClaimEntryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
    this.initializeForm();
  }

  get entries(): FormArray {
    return this.expenseForm.get('entries') as FormArray;
  }

  private initializeForm(): void {
    this.expenseForm = this.fb.group({
      id: [this.expenseClaim.id],
      date: [this.formatDateForInput(this.expenseClaim.date), Validators.required],
      employeeId: [this.expenseClaim.employeeId, Validators.required],
      status: [this.expenseClaim.status, Validators.required],
      description: [this.expenseClaim.description],
      entries: this.fb.array([])
    });

    const entries = this.expenseClaim.expenseClaimEntries || [];
    entries.forEach((entry: any) => {
      this.initialEntryIds.add(entry.id);
      this.entries.push(this.fb.group({
        id: [entry.id],
        date: [this.formatDateForInput(entry.date), Validators.required],
        expenseTypeId: [entry.expenseTypeId, Validators.required],
        total: [entry.total, [Validators.required, Validators.min(0.01)]],
        description: [entry.description]
      }));
    });
  }

  loadDropdownData(): void {
    this.employeeService.getEmployees().subscribe(data => this.employees = data);
    this.expenseTypeService.getExpenseTypes().subscribe(data => this.expenseTypes = data);
  }

  private formatDateForInput = (d: string): string | null => d ? `${d.split('/')[2]}-${d.split('/')[1]}-${d.split('/')[0]}` : null;
  private formatDateForApi = (d: string): string | null => d ? `${d.split('-')[2]}/${d.split('-')[1]}/${d.split('-')[0]}` : null;

  addEntry(): void {
    this.entries.push(this.fb.group({
      id: [null],
      date: ['', Validators.required],
      expenseTypeId: [null, Validators.required],
      total: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    }));
  }

  removeEntry(index: number): void {
    this.entries.removeAt(index);
  }

  saveExpense(): void {
    if (this.expenseForm.invalid) {
      this.errorMessage = "Please fill out all required fields correctly.";
      this.expenseForm.markAllAsTouched();
      return;
    }
    if (this.isSaving) return;

    this.isSaving = true;
    this.errorMessage = null;

    const formValue = this.expenseForm.getRawValue();
    const claimPayload = { ...formValue, date: this.formatDateForApi(formValue.date) };
    delete claimPayload.entries;

    this.expenseClaimService.updateExpenseClaim(claimPayload.id, claimPayload).pipe(
      switchMap(() => {
        const addObs: Observable<any>[] = [];
        const updateObs: Observable<any>[] = [];
        const deleteObs: Observable<any>[] = [];

        const currentEntryIds = new Set(formValue.entries.map((e: any) => e.id).filter(Boolean));

        this.initialEntryIds.forEach(id => {
          if (!currentEntryIds.has(id)) {
            deleteObs.push(this.expenseClaimEntryService.deleteExpenseClaimEntry(id));
          }
        });

        // 2. Identify entries to ADD or UPDATE
        formValue.entries.forEach((entry: any) => {
          const entryPayload = { ...entry, date: this.formatDateForApi(entry.date) };

          if (entry.id) {
            updateObs.push(this.expenseClaimEntryService.updateExpenseClaimEntry(entry.id, entryPayload));
          } else {
            entryPayload.expenseClaimId = claimPayload.id;
            addObs.push(this.expenseClaimEntryService.addExpenseClaimEntry(entryPayload));
          }
        });

        const allOperations = [...addObs, ...updateObs, ...deleteObs];
        return allOperations.length > 0 ? forkJoin(allOperations) : of(null);
      })
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.expenseSaved.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error saving expense claim:', err);
        this.errorMessage = 'Failed to save changes. Please try again.';
        this.isSaving = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
