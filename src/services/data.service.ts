import { Injectable, inject } from '@angular/core';
import { QuizService } from './quiz.service';
import { ScheduleService } from './schedule.service';
import { NotepadService } from './notepad.service';
import { FlashcardService } from './flashcard.service';
import { GoalService } from './goal.service';
import { ResourceService } from './resource.service';

interface AppData {
  quizzes: any;
  quizHistory: any;
  schedule: any;
  notepad: any;
  flashcards: any;
  goals: any;
  resources: any;
  version: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private quizService = inject(QuizService);
  private scheduleService = inject(ScheduleService);
  private notepadService = inject(NotepadService);
  private flashcardService = inject(FlashcardService);
  private goalService = inject(GoalService);
  private resourceService = inject(ResourceService);

  exportData() {
    const appData: AppData = {
      quizzes: this.quizService.allQuizzes(),
      quizHistory: this.quizService.history(),
      schedule: this.scheduleService.scheduleData(),
      notepad: this.notepadService.notes(),
      flashcards: this.flashcardService.allSets(),
      goals: this.goalService.allGoals(),
      resources: this.resourceService.allResources(),
      version: 1
    };

    const jsonString = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `study-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importData(jsonString: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const appData: AppData = JSON.parse(jsonString);

        if (appData.version !== 1) {
            reject(new Error('ملف النسخ الاحتياطي غير متوافق.'));
            return;
        }

        // We can add more robust validation here
        if (appData.quizzes) this.quizService['quizzes'].set(appData.quizzes);
        if (appData.quizHistory) this.quizService['quizHistory'].set(appData.quizHistory);
        if (appData.schedule) this.scheduleService.loadSchedule(appData.schedule);
        if (appData.notepad) this.notepadService.loadNotes(appData.notepad);
        if (appData.flashcards) this.flashcardService['sets'].set(appData.flashcards);
        if (appData.goals) this.goalService['goals'].set(appData.goals);
        if (appData.resources) this.resourceService['resources'].set(appData.resources);
        
        // Trigger save for all services
        this.quizService['saveToLocalStorage'](appData.quizzes, appData.quizHistory);
        // Other services save automatically via effects, so loading them is enough.

        resolve();
      } catch (error) {
        console.error("Import failed:", error);
        reject(new Error('فشل استيراد البيانات. تأكد من أن الملف صحيح.'));
      }
    });
  }
}
