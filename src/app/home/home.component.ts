import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Warehouse,
  Package,
  FileText,
  BarChart,
  Settings,
  User,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // آیکون‌ها
  Warehouse = Warehouse;
  Package = Package;
  FileText = FileText;
  BarChart = BarChart;
  Settings = Settings;
  User = User;

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
