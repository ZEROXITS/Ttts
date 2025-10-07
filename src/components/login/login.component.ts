import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center h-full w-full bg-black/30">
      <div class="glass-card w-full max-w-md p-8 space-y-8 rounded-2xl shadow-2xl">
        <div>
          <h1 class="text-4xl font-black text-center text-white text-glow">
            مرحباً بك في Study Hub
          </h1>
          <p class="mt-2 text-center text-lg text-gray-300">
            سجّل دخولك باستخدام بريدك الإلكتروني للمتابعة
          </p>
        </div>
        <form class="space-y-6" (ngSubmit)="login(emailInput.value)">
          <div>
            <label for="email" class="sr-only">البريد الإلكتروني</label>
            <input #emailInput id="email" name="email" type="email" required
                   class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   placeholder="أدخل بريدك الإلكتروني">
          </div>
          
          @if(error()) {
            <p class="text-red-400 text-sm text-center">{{ error() }}</p>
          }

          <div>
            <button type="submit"
                    class="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-800 transition-colors btn-3d border-indigo-800">
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  authService = inject(AuthService);
  // Fix: Explicitly type the router to resolve the 'unknown' type error.
  router: Router = inject(Router);
  error = signal('');

  login(email: string) {
    this.error.set('');
    if (this.authService.login(email)) {
      this.router.navigate(['/']);
    } else {
      this.error.set('الرجاء إدخال بريد إلكتروني صالح.');
    }
  }
}