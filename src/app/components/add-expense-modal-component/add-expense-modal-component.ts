import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee-service';
import { ExpenseTypeService } from '../../services/expense-types-service';
import { ExpenseClaimService } from '../../services/expense-claim-service';

@Component({
  selector: 'app-add-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense-modal-component.html',
  styleUrls: ['./add-expense-modal-component.css']
})
export class AddExpenseModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() expenseSaved = new EventEmitter<void>();

  expenseClaim: any = {
    date: null,
    status: 'Pending',
    employeeId: null,
    description: '',
    entries: []
  };

  employees: any[] = [];
  expenseTypes: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private expenseTypeService: ExpenseTypeService,
    private expenseClaimService: ExpenseClaimService
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
    this.addEntry();
  }

  loadDropdownData(): void {
    this.employeeService.getEmployees().subscribe(data => this.employees = data);
    this.expenseTypeService.getExpenseTypes().subscribe(data => this.expenseTypes = data);
  }

  addEntry(): void {
    this.expenseClaim.entries.push({
      date: null,
      expenseTypeId: null,
      total: null,
      description: ''
    });
  }

  removeEntry(index: number): void {
    this.expenseClaim.entries.splice(index, 1);
  }

  saveExpense(): void {
    if (!this.expenseClaim.date || !this.expenseClaim.employeeId || this.expenseClaim.entries.length === 0) {
      this.errorMessage = 'Main date, employee, and at least one entry are required.';
      return;
    }

    for (const entry of this.expenseClaim.entries) {
      if (!entry.date || !entry.expenseTypeId || entry.total === null || entry.total === '' || entry.total === undefined) {
        this.errorMessage = 'For each entry, date, expense type, and total are required.';
        return;
      }
    }

    this.errorMessage = null;

    const payload = JSON.parse(JSON.stringify(this.expenseClaim));

    try {
      let dateParts = payload.date.split('-');
      payload.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

      for (const entry of payload.entries) {
        dateParts = entry.date.split('-');
        entry.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        const totalAsNumber = parseFloat(entry.total);
        if (isNaN(totalAsNumber)) {
          this.errorMessage = `An invalid total was entered: "${entry.total}". Please enter a valid number.`;
          return;
        }
        entry.total = totalAsNumber;
      }
    } catch (e) {
      this.errorMessage = 'An invalid date was provided. Please check all date fields.';
      return;
    }

    this.expenseClaimService.addFullExpenseClaim(payload).subscribe({
      next: () => {
        this.expenseSaved.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error adding expense claim:', err);
        this.errorMessage = 'Failed to save the expense claim. Please try again.';
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
