import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppEnum } from '../enum/app-enum.enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public showClickIcon: boolean = false;
  public productManagement: boolean = false;
  public anbarReport: boolean = false;
  public anbarSetting: boolean = false;
  public appEnum = AppEnum;

  constructor(
    private router: Router
  ) { }
  protected productBankAction() {
    this.router.navigate(['/product'])
  }

  protected storeroomAction(): void {
    this.router.navigate(['/warehouse-list'])
  }

  protected commodityTypeAction(): void {
    this.router.navigate(['/commodity-type'])
  }

  public test() {
    this.showClickIcon = !this.showClickIcon
  }

  public productManagementAction(): void {
    this.productManagement = !this.productManagement;
  }

  public anbarReportAction(): void {
    this.anbarReport = !this.anbarReport;
  }

  public anbarSettingAction(): void {
    this.anbarSetting = !this.anbarSetting;
  }
}
