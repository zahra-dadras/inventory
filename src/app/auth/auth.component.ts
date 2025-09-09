import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  login() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          alert('ورود موفقیت‌آمیز بود');
          this.router.navigate(['/warehouse-list']);
        },
        error: (err) => alert('خطا در ورود: ' + err.error.message),
      });
  }

  register() {
    if (this.password !== this.confirmPassword) {
      alert('رمز عبور و تکرار آن یکسان نیست');
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
          alert('ثبت‌نام موفقیت‌آمیز بود، حالا وارد شوید');
          this.switchTab('login');
        },
        error: (err) => alert('خطا در ثبت‌نام: ' + err.error.message),
      });
  }
}
