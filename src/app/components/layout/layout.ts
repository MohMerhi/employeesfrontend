
import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { EmployeesComponent } from '../employees-component/employees-component';
import { LeavesComponent } from '../leaves-component/leaves-component';
import { ExpensesComponent } from '../expenses-component/expenses-component';
import { CommonModule } from '@angular/common';
import { ViewStateService, AppView } from '../../services/view-state-service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    EmployeesComponent,
    Sidebar,
    LeavesComponent,
    ExpensesComponent,
  ],
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {
  currentView: AppView = 'employees';

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private viewStateService: ViewStateService
  ) { }

  ngOnInit(): void {
    this.currentView = this.viewStateService.lastView;
  }

  onViewChange(view: AppView): void {
    this.currentView = view;
    this.viewStateService.lastView = view;
  }

  toggleSidebar() {
    const body = this.document.body;
    if (body.classList.contains('sb-sidenav-toggled')) {
      this.renderer.removeClass(body, 'sb-sidenav-toggled');
    } else {
      this.renderer.addClass(body, 'sb-sidenav-toggled');
    }
  }
}
