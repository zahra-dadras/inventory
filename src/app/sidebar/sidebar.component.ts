import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppEnum } from '../enum/app-enum.enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public showClickIcon: boolean = false;
  public commodityManagement: boolean = false;
  public anbarReport: boolean = false;
  public anbarSetting: boolean = false;
  public appEnum = AppEnum;

  constructor(private router: Router) {}
  protected commodityBankAction() {
    this.router.navigate(['/commodity']);
  }

  protected storeroomAction(): void {
    this.router.navigate(['/warehouse-list']);
  }

  protected commodityTypeAction(): void {
    this.router.navigate(['/commodity-type']);
  }

  protected measurementUnitAction(): void {
    this.router.navigate(['/measurement-unit']);
  }

  public test() {
    this.showClickIcon = !this.showClickIcon;
  }

  public commodityManagementAction(): void {
    this.commodityManagement = !this.commodityManagement;
  }

  public anbarReportAction(): void {
    this.anbarReport = !this.anbarReport;
  }

  public anbarSettingAction(): void {
    this.anbarSetting = !this.anbarSetting;
  }
}
