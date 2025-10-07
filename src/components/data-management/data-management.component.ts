import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagementComponent {
  private dataService = inject(DataService);
  notification = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  exportData() {
    this.dataService.exportData();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const jsonString = e.target?.result as string;
        await this.dataService.importData(jsonString);
        this.showNotification('تم استيراد البيانات بنجاح! سيتم تحديث الصفحة.', 'success');
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف.';
        this.showNotification(errorMessage, 'error');
      }
    };

    reader.onerror = () => {
        this.showNotification('فشل في قراءة الملف.', 'error');
    };

    reader.readAsText(file);
    input.value = ''; // Reset input
  }

  triggerImport() {
    if (confirm('تحذير: استيراد البيانات سيقوم بالكتابة فوق جميع بياناتك الحالية. هل أنت متأكد من المتابعة؟')) {
        document.getElementById('import-input')?.click();
    }
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => this.notification.set(null), 5000);
  }
}
