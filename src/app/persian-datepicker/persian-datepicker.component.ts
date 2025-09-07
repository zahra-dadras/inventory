import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment-jalaali';
import { AppEnum } from '../enum/app-enum.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-persian-datepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './persian-datepicker.component.html',
  styleUrl: './persian-datepicker.component.scss',
})
export class PersianDatepickerComponent {
  @Output() dateSelected = new EventEmitter<string>();

  days: string[] = [];
  currentMonth: string = '';
  selectedDate: string | null = null;

  constructor() {
    // moment.loadPersian({ dialect: 'persian-modern' });
    this.generateCalendar(moment());
  }

  generateCalendar(baseDate: any) {
    this.currentMonth = baseDate.format('jMMMM jYYYY');
    this.days = [];
    const startOfMonth = baseDate.clone().startOf('jMonth');
    const endOfMonth = baseDate.clone().endOf('jMonth');

    let day = startOfMonth.clone();
    while (day.isBefore(endOfMonth) || day.isSame(endOfMonth)) {
      this.days.push(day.format('jYYYY/jMM/jDD'));
      day.add(1, 'day');
    }
  }

  selectDate(date: string) {
    this.selectedDate = date;
    this.dateSelected.emit(date); // به فرم میفرسته
  }
}
