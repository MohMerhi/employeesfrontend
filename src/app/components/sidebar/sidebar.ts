import { Component, Output, EventEmitter } from '@angular/core';
import {AppView} from '../../services/view-state-service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Output() viewChangeEvent = new EventEmitter<AppView>();


  changeView(view: AppView) {
    this.viewChangeEvent.emit(view);
  }


}
