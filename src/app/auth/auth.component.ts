import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { AppEnum } from '../enum/app-enum.enum';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  protected activeTab: 'login' | 'register' = 'login';

  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';

  protected appEnum = AppEnum;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

 protected switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

 protected login() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          this.toastService.success('ورود موفقیت‌آمیز بود');
          this.router.navigate(['/home-page']);
        },
        error: (err) => {
          this.toastService.error(err.error?.message);
        },
      });
  }

 protected register() {
    if (this.password !== this.confirmPassword) {
      this.toastService.error('رمز عبور و تکرار آن یکسان نیست');
      return;
    }

    this.authService
      .register({
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.toastService.success('ثبت‌نام موفقیت‌آمیز بود حالا وارد شوید');
          this.switchTab('login');
        },
        error: (err) => {
          this.toastService.error(err.error?.message);
        },
      });
  }
}
