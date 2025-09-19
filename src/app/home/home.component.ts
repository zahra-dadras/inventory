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
  Layers,
  LucideAngularModule,
  Ruler
} from 'lucide-angular';
import { AppEnum } from '../enum/app-enum.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  Warehouse = Warehouse;
  Package = Package;
  FileText = FileText;
  BarChart = BarChart;
  Settings = Settings;
  User = User;
  Layers = Layers;
  Ruler = Ruler;

  protected appEnum = AppEnum;

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
