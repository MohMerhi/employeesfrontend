import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ExpenseClaimService } from '../../services/expense-claim-service';
import { AddExpenseEntryModalComponent } from '../add-expense-entry-modal-component/add-expense-entry-modal-component';
import { DeleteExpenseEntryModalComponent } from '../delete-expense-entry-modal-component/delete-expense-entry-modal-component';
import { EditExpenseClaimModalComponent } from '../edit-expense-claim-modal-component/edit-expense-claim-modal-component';

@Component({
  selector: 'app-expense-claim-entries',
  standalone: true,
  imports: [CommonModule, AddExpenseEntryModalComponent, DeleteExpenseEntryModalComponent, EditExpenseClaimModalComponent],
  templateUrl: './expense-claim-entries-component.html',
  styleUrls: ['./expense-claim-entries-component.css']
})
export class ExpenseClaimEntriesComponent implements OnInit {
  expenseClaim: any;
  errorMessage: string | null = null;

  isEntryModalOpen = false;
  entryToEdit: any = null;

  isDeleteModalOpen = false;
  entryToDelete: any = null;

  isEditClaimModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private expenseClaimService: ExpenseClaimService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadExpenseClaim();
  }

  loadExpenseClaim(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.expenseClaimService.getExpenseClaimById(id).subscribe({
        next: (data) => {
          this.expenseClaim = data;
        },
        error: (err) => {
          console.error('Error fetching expense claim details:', err);
          this.errorMessage = 'Could not load the details for the expense claim.';
        }
      });
    }
  }

  openEntryModal(entry: any = null): void {
    this.entryToEdit = entry;
    this.isEntryModalOpen = true;
  }

  closeEntryModal(): void {
    this.isEntryModalOpen = false;
    this.entryToEdit = null;
  }

  onEntrySaved(): void {
    this.loadExpenseClaim();
    this.closeEntryModal();
  }

  openDeleteModal(entry: any): void {
    this.entryToDelete = entry;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.entryToDelete = null;
  }

  onEntryDeleted(): void {
    this.loadExpenseClaim();
    this.closeDeleteModal();
  }

  openEditClaimModal(): void {
    this.isEditClaimModalOpen = true;
  }

  closeEditClaimModal(): void {
    this.isEditClaimModalOpen = false;
  }

  onClaimSaved(): void {
    this.loadExpenseClaim();
    this.closeEditClaimModal();
  }

  goBack(): void {
    this.location.back();
  }
}
