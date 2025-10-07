import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styles: [`
    .calculator-btn {
      @apply h-16 rounded-2xl text-2xl font-bold text-white transition-all duration-150 flex items-center justify-center;
      background: linear-gradient(145deg, #2e323b, #262930);
      box-shadow: 5px 5px 10px #21242a, -5px -5px 10px #333842;
    }
    .calculator-btn:active {
      box-shadow: inset 5px 5px 10px #21242a, inset -5px -5px 10px #333842;
      font-size: 1.4rem;
    }
    .operator-btn {
      @apply text-yellow-400;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent {
  display = signal('0');

  handleInput(value: string) {
    this.display.update(current => {
      if (current === '0' && value !== '.') {
        return value;
      }
      if (['+', '-', '*', '/'].includes(value) && ['+', '-', '*', '/'].includes(current.slice(-1))) {
          // Prevent double operators
          return current.slice(0, -1) + value;
      }
      return current + value;
    });
  }

  calculate() {
    this.display.update(current => {
      try {
        // Simple and safe evaluation without using eval()
        const result = new Function('return ' + current)();
        return String(result);
      } catch (error) {
        return 'Error';
      }
    });
  }

  clear() {
    this.display.set('0');
  }

  backspace() {
    this.display.update(current => {
        if (current.length > 1) {
            return current.slice(0, -1);
        }
        return '0';
    });
  }
}