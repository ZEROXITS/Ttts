

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';
import { APP_ROUTES } from './src/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(),
  ],
});

// AI Studio always uses an `index.tsx` file for all project types.
