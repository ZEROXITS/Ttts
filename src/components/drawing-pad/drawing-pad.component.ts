
import { Component, ViewChild, ElementRef, AfterViewInit, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';

@Component({
  selector: 'app-drawing-pad',
  templateUrl: './drawing-pad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingPadComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  
  penColor = signal('#000000');
  penWidth = signal(5);

  ngAfterViewInit() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      this.ctx = context;
      this.resizeCanvas();
    }
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (this.ctx) {
        const canvasEl = this.canvas.nativeElement;
        // Save drawing
        const data = this.ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
        // Resize
        canvasEl.width = canvasEl.offsetWidth;
        canvasEl.height = canvasEl.offsetHeight;
        // Restore drawing
        this.ctx.putImageData(data, 0, 0);
    }
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineWidth = this.penWidth();
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.penColor();
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.closePath();
  }
  
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  onColorChange(event: Event) {
      this.penColor.set((event.target as HTMLInputElement).value);
  }

  onWidthChange(event: Event) {
      this.penWidth.set(Number((event.target as HTMLInputElement).value));
  }
}
