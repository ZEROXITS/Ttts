import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      if (typeof document !== 'undefined') {
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('study-hub-theme', currentTheme);
      }
    });
  }

  private getInitialTheme(): Theme {
     if (typeof localStorage !== 'undefined') {
        return (localStorage.getItem('study-hub-theme') as Theme) || 'dark';
     }
     return 'dark';
  }

  toggleTheme() {
    this.theme.update(current => current === 'dark' ? 'light' : 'dark');
  }
}
