import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { DepartmentService } from '../../services/department-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeModalComponent } from '../add-employee-modal-component/add-employee-modal-component';
import { DeleteEmployeeComponent } from '../delete-employee-component/delete-employee-component';

@Component({
  selector: 'app-employees-component',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeModalComponent, DeleteEmployeeComponent], // Add DeleteEmployeeComponent
  templateUrl: './employees-component.html',
  styleUrls: ['./employees-component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  departments: any[] = [];
  searchTerm: string = '';

  isEmployeeModalOpen = false;
  employeeToEdit: any = null;

  isDeleteModalOpen = false;
  employeeToDelete: any = null;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filterEmployees();
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Error fetching departments:', err)
    });
  }

  openEmployeeModal(employee: any = null): void {
    this.employeeToEdit = employee;
    this.isEmployeeModalOpen = true;
  }

  closeEmployeeModal(): void {
    this.isEmployeeModalOpen = false;
    this.employeeToEdit = null;
  }

  onEmployeeSaved(): void {
    this.loadEmployees();
    this.closeEmployeeModal();
  }

  openDeleteModal(employee: any): void {
    this.employeeToDelete = employee;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.employeeToDelete = null;
  }

  onEmployeeDeleted(): void {
    this.loadEmployees();
    this.closeDeleteModal();
  }

  filterEmployees(): void {
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees;
    } else {
      this.filteredEmployees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
