import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  days = signal(['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']);
  times = signal(['8-9', '9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4']);
  scheduleData = signal<Record<string, string>>({});
  
  private storageKey = 'study-hub-schedule';

  constructor() {
    this.loadFromLocalStorage();

    effect(() => {
      // This effect runs whenever scheduleData changes, automatically saving it.
      this.saveToLocalStorage();
    });
  }

  updateCell(day: string, time: string, value: string) {
    this.scheduleData.update(current => {
      const key = `${day}-${time}`;
      current[key] = value;
      return {...current};
    });
  }

  clearSchedule() {
    this.scheduleData.set({});
  }

  loadSchedule(data: Record<string, string>) {
    this.scheduleData.set(data);
  }

  private loadFromLocalStorage() {
     if (typeof localStorage !== 'undefined') {
        const savedData = localStorage.getItem(this.storageKey);
        this.scheduleData.set(savedData ? JSON.parse(savedData) : {});
     }
  }

  private saveToLocalStorage() {
     if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.scheduleData()));
     }
  }
}
