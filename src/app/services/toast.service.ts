import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'موفقیت') {
    this.toastr.success(message, title);
  }

  error(message: string, title: string = 'خطا') {
    this.toastr.error(message, title);
  }

  info(message: string, title: string = 'اطلاع') {
    this.toastr.info(message, title);
  }

  warning(message: string, title: string = 'هشدار') {
    this.toastr.warning(message, title);
  }
}
