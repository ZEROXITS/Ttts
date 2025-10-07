import { Injectable, signal } from '@angular/core';

export interface User {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using localStorage for persistent login across sessions
  currentUser = signal<User | null>(this.getInitialUser());

  private getInitialUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const userJson = localStorage.getItem('study-hub-user');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  login(email: string): boolean {
    // Basic email validation
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const user: User = { email: email };
      localStorage.setItem('study-hub-user', JSON.stringify(user));
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('study-hub-user');
    this.currentUser.set(null);
  }
}