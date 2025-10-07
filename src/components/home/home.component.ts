import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
    .feature-card {
      @apply text-center glass-card p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300;
    }
    .card-icon {
        @apply w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-in-out forwards;
      opacity: 0;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dashboard-widget {
      @apply glass-card p-6 rounded-2xl flex flex-col;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule]
})
export class HomeComponent {
    goalService = inject(GoalService);
    quizService = inject(QuizService);
    
    // Quick Stats
    incompleteGoals = computed(() => this.goalService.allGoals().filter(g => !g.isCompleted).length);
    latestQuizResult = computed(() => this.quizService.history()[0] ?? null);
    
    welcomeMessage = computed(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'صباح الخير';
        if (hour < 18) return 'مساء الخير';
        return 'أتمنى أن يومك كان جيداً';
    });
}