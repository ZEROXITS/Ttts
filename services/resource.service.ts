import { Injectable, signal, effect, inject } from '@angular/core';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resources = signal<Resource[]>([]);
  private storageKey = 'study-hub-resources';

  allResources = this.resources.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
  }

  addResource(resource: Omit<Resource, 'id'>) {
    this.resources.update(current => {
      const newResource: Resource = { ...resource, id: Date.now() };
      const updated = [newResource, ...current];
      this.saveToLocalStorage(updated);
      return updated;
    });
  }

  deleteResource(id: number) {
    this.resources.update(current => {
      const updated = current.filter(r => r.id !== id);
      this.saveToLocalStorage(updated);
      return updated;
    });
  }

  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined' && this.storageKey) {
      const savedData = localStorage.getItem(this.storageKey);
      this.resources.set(savedData ? JSON.parse(savedData) : []);
    }
  }

  private saveToLocalStorage(resources: Resource[]) {
    if (typeof localStorage !== 'undefined' && this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(resources));
    }
  }
}