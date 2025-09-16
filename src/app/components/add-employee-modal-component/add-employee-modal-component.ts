import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { DepartmentService } from '../../services/department-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee-modal-component.html',
  styleUrls: ['./add-employee-modal-component.css']
})
export class EmployeeModalComponent implements OnInit {
  @Input() employee: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() employeeSaved = new EventEmitter<void>();

  departments: any[] = [];
  employeeData: any = { name: '', email: '', address: '', departmentId: null };
  isEditMode = false;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    if (this.employee) {
      this.isEditMode = true;
      this.employeeData = { ...this.employee };
    }
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Error fetching departments:', err)
    });
  }

  saveEmployee(): void {
    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeData.id, this.employeeData).subscribe({
        next: () => {
          this.employeeSaved.emit();
          this.close();
        },
        error: (err) => console.error('Error updating employee:', err)
      });
    } else {
      this.employeeService.addEmployee(this.employeeData).subscribe({
        next: () => {
          this.employeeSaved.emit();
          this.close();
        },
        error: (err) => console.error('Error adding employee:', err)
      });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
