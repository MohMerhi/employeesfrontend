import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth-service'; // Import AuthService

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
