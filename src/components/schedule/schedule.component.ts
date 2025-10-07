import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  private scheduleService = inject(ScheduleService);
  
  days = this.scheduleService.days;
  times = this.scheduleService.times;
  scheduleData = this.scheduleService.scheduleData;

  updateCell(day: string, time: string, event: Event) {
    const target = event.target as HTMLTableCellElement;
    const value = target.innerText;
    this.scheduleService.updateCell(day, time, value);
  }

  getCellData(day: string, time: string): string {
    const key = `${day}-${time}`;
    return this.scheduleData()[key] || '';
  }

  clearSchedule() {
    if(confirm('هل أنت متأكد من أنك تريد مسح الجدول بأكمله؟')) {
        this.scheduleService.clearSchedule();
    }
  }

  printSchedule() {
    window.print();
  }
}
