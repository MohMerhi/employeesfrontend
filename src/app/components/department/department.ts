import {Component, OnInit} from '@angular/core';
import {DepartmentService} from '../../services/department-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-department',
  imports: [CommonModule],
  providers: [DepartmentService],
  standalone: true,
  templateUrl: './department.html',
  styleUrl: './department.css'
})
export class Department implements OnInit {
  departments: any[] = [];

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Error fetching departments', err)
    });
  }
}
