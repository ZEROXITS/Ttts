import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';

@Component({
  selector: 'app-resource-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-hub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceHubComponent {
  resourceService = inject(ResourceService);
  
  newResource = signal({ title: '', url: '', category: '' });
  filterCategory = signal('all');

  allResources = this.resourceService.allResources;
  
  categories = computed(() => {
    const cats = this.allResources().map(r => r.category.trim()).filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  });

  filteredResources = computed(() => {
    const category = this.filterCategory();
    if (category === 'all') {
      return this.allResources();
    }
    return this.allResources().filter(r => r.category === category);
  });
  
  updateNewResourceField(field: 'title' | 'url' | 'category', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.newResource.update(r => ({ ...r, [field]: value }));
  }

  addResource() {
    const { title, url, category } = this.newResource();
    if (title.trim() && url.trim() && category.trim()) {
      try {
        // Validate URL
        new URL(url);
        this.resourceService.addResource({ title, url, category });
        this.newResource.set({ title: '', url: '', category: '' });
      } catch (_) {
        alert('الرجاء إدخال رابط صحيح.');
      }
    }
  }

  deleteResource(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      this.resourceService.deleteResource(id);
    }
  }
}
