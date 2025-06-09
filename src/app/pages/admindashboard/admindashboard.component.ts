import { Component } from '@angular/core';
import { DashboardExamsTableComponent } from "../../components/dashboard-exams-table/dashboard-exams-table.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admindashboard',
  imports: [DashboardExamsTableComponent, FormsModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css',
})
export class AdmindashboardComponent {
  filterText: string = '';
}
