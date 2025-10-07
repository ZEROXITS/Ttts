import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { DrawingPadComponent } from './components/drawing-pad/drawing-pad.component';
import { NotepadComponent } from './components/notepad/notepad.component';
import { AiSolverComponent } from './components/ai-solver/ai-solver.component';
import { QuizMakerComponent } from './components/quiz-maker/quiz-maker.component';
import { QuizTakerComponent } from './components/quiz-taker/quiz-taker.component';
import { FocusTimerComponent } from './components/focus-timer/focus-timer.component';
import { FlashcardsComponent } from './components/flashcards/flashcards.component';
import { GoalTrackerComponent } from './components/goal-tracker/goal-tracker.component';
import { ResourceHubComponent } from './components/resource-hub/resource-hub.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { DataManagementComponent } from './components/data-management/data-management.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, title: 'الرئيسية' },
  { path: 'schedule', component: ScheduleComponent, title: 'الجدول الدراسي' },
  { path: 'calculator', component: CalculatorComponent, title: 'آلة حاسبة' },
  { path: 'drawing', component: DrawingPadComponent, title: 'لوحة رسم' },
  { path: 'notepad', component: NotepadComponent, title: 'مفكرة' },
  { path: 'ai-solver', component: AiSolverComponent, title: 'المساعد الذكي' },
  { path: 'focus-timer', component: FocusTimerComponent, title: 'مؤقت التركيز' },
  { path: 'quiz-maker', component: QuizMakerComponent, title: 'صانع الاختبارات' },
  { path: 'quiz-taker', component: QuizTakerComponent, title: 'بدء اختبار' },
  { path: 'flashcards', component: FlashcardsComponent, title: 'بطاقات تعليمية' },
  { path: 'goals', component: GoalTrackerComponent, title: 'متتبع الأهداف' },
  { path: 'resources', component: ResourceHubComponent, title: 'مركز الموارد' },
  { path: 'analytics', component: AnalyticsComponent, title: 'تحليلات التقدم' },
  { path: 'data', component: DataManagementComponent, title: 'إدارة البيانات' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
