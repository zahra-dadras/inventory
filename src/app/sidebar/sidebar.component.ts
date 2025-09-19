import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Warehouse,
  Home,
  Package,
  FileText,
  BarChart,
  Settings,
  Layers,
  Ruler,
  ChevronDown,
  ChevronUp,
  LogOut,
} from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppEnum } from '../enum/app-enum.enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  readonly Home = Home;
  readonly Package = Package;
  readonly FileText = FileText;
  readonly BarChart = BarChart;
  readonly Settings = Settings;
  readonly Layers = Layers;
  readonly Ruler = Ruler;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly LogOut = LogOut;
  readonly Warehouse = Warehouse;

  showSettings = false;

  protected appEnum = AppEnum;
  constructor(private authService: AuthService, private router: Router) {}

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
