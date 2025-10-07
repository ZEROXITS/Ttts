import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../services/goal.service';

@Component({
  selector: 'app-goal-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-tracker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalTrackerComponent {
  goalService = inject(GoalService);
  goals = this.goalService.allGoals;
  newGoalText = signal('');

  completedGoals = computed(() => this.goals().filter(g => g.isCompleted));
  progress = computed(() => {
    const total = this.goals().length;
    return total > 0 ? (this.completedGoals().length / total) * 100 : 0;
  });

  addGoal() {
    if (this.newGoalText().trim()) {
      this.goalService.addGoal(this.newGoalText());
      this.newGoalText.set('');
    }
  }

  toggleGoal(id: number) {
    this.goalService.toggleGoal(id);
  }

  deleteGoal(id: number) {
    this.goalService.deleteGoal(id);
  }
}
