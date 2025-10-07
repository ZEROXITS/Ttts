import { ChangeDetectionStrategy, Component, inject, afterNextRender, ElementRef, viewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService, QuizResult } from '../../services/quiz.service';
import { GoalService } from '../../services/goal.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  quizService = inject(QuizService);
  goalService = inject(GoalService);

  quizHistory = this.quizService.history;
  goals = this.goalService.allGoals;

  completedGoals = computed(() => this.goals().filter(g => g.isCompleted).length);
  incompleteGoals = computed(() => this.goals().length - this.completedGoals());

  private scoreChart = viewChild<ElementRef>('scoreChart');
  private goalChart = viewChild<ElementRef>('goalChart');

  constructor() {
    afterNextRender(() => {
      this.drawScoreTrendChart();
      this.drawGoalCompletionChart();
    });
  }

  private drawScoreTrendChart(): void {
    const element = this.scoreChart()?.nativeElement;
    if (!element || this.quizHistory().length < 2) return;

    const data = [...this.quizHistory()].reverse(); // Oldest first
    
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %d")))
      .selectAll("text")
      .style("fill", "#9ca3af");

    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#9ca3af");

    const line = d3.line<QuizResult>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.score));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.score))
        .attr('r', 4)
        .attr('fill', '#818cf8');
  }

  private drawGoalCompletionChart(): void {
    const element = this.goalChart()?.nativeElement;
    if (!element || this.goals().length === 0) return;

    const data = [
        { label: 'مكتملة', value: this.completedGoals() },
        { label: 'غير مكتملة', value: this.incompleteGoals() }
    ];

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(['#22c55e', '#374151']);

    const pie = d3.pie<{label: string, value: number}>()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc<any>()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label) as string);
  }
}
