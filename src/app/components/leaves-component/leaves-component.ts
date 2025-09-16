import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeavingService } from '../../services/leaving-service';
import { EmployeeService } from '../../services/employee-service';
import { LeaveTypeService } from '../../services/leave-type-service';
import { AddLeaveModalComponent } from '../add-leave-modal-component/add-leave-modal-component';
import { DeleteLeaveComponent } from '../delete-leave-component/delete-leave-component';

@Component({
  selector: 'app-leaves-component',
  standalone: true,
  imports: [CommonModule, FormsModule, AddLeaveModalComponent, DeleteLeaveComponent],
  templateUrl: './leaves-component.html',
  styleUrls: ['./leaves-component.css']
})
export class LeavesComponent implements OnInit {
  leaves: any[] = [];
  private allLeaves: any[] = [];
  employees: any[] = [];
  leaveTypes: any[] = [];

  filterType: 'all' | 'employee' | 'leaveType' = 'all';
  filterValue: number | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  isLeaveModalOpen = false;
  leaveToEdit: any = null;

  isDeleteModalOpen = false;
  leaveToDelete: any = null;

  constructor(
    private leavingService: LeavingService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit(): void {
    this.loadFilterData();
    this.loadLeaves();
  }

  loadFilterData(): void {
    this.employeeService.getEmployees().subscribe(data => this.employees = data);
    this.leaveTypeService.getLeaveTypes().subscribe(data => this.leaveTypes = data);
  }

  loadLeaves(): void {
    const pageRequest = { pageNumber: this.currentPage - 1, pageSize: this.pageSize };

    if (this.filterType === 'employee' && this.filterValue) {
      this.leavingService.getLeavesByEmployee(this.filterValue, pageRequest).subscribe({
        next: (response) => {
          this.leaves = response.content;
          this.totalPages = response.totalPages;
        },
        error: (err) => console.error('Error fetching filtered leaves:', err)
      });
    } else if (this.filterType === 'leaveType' && this.filterValue) {
      this.leavingService.getLeavesByLeaveType(this.filterValue, pageRequest).subscribe({
        next: (response) => {
          this.leaves = response.content;
          this.totalPages = response.totalPages;
        },
        error: (err) => console.error('Error fetching filtered leaves:', err)
      });
    } else {
      this.leavingService.getLeavings().subscribe(data => {
        this.allLeaves = data;
        this.totalPages = Math.ceil(this.allLeaves.length / this.pageSize);
        this.setPage(this.currentPage);
      });
    }
  }

  updatePaginatedLeaves(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.leaves = this.allLeaves.slice(startIndex, startIndex + this.pageSize);
  }

  onFilterTypeChange(): void {
    this.filterValue = null;
    this.currentPage = 1;
    this.loadLeaves();
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadLeaves();
  }

  setPage(pageNumber: number): void {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > this.totalPages && this.totalPages > 0) pageNumber = this.totalPages;

    this.currentPage = pageNumber;

    if (this.filterType === 'all') {

      this.updatePaginatedLeaves();
    } else {
      this.loadLeaves();
    }
  }

  goToNextPage(): void { this.setPage(this.currentPage + 1); }
  goToPreviousPage(): void { this.setPage(this.currentPage - 1); }

  openLeaveModal(leave: any = null): void {
    this.leaveToEdit = leave;
    this.isLeaveModalOpen = true;
  }

  closeLeaveModal(): void {
    this.isLeaveModalOpen = false;
    this.leaveToEdit = null;
  }

  onLeaveSaved(): void {
    this.loadLeaves();
    this.closeLeaveModal();
  }

  openDeleteModal(leave: any): void {
    this.leaveToDelete = leave;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.leaveToDelete = null;
  }

  onLeaveDeleted(): void {
    if (this.leaves.length === 1 && this.currentPage > 1) {
      this.currentPage--;
    }
    this.loadLeaves();
    this.closeDeleteModal();
  }
}
