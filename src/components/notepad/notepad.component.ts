import { ChangeDetectionStrategy, Component, signal, effect, inject } from '@angular/core';
import { NotepadService } from '../../services/notepad.service';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotepadComponent {
  private notepadService = inject(NotepadService);
  
  notes = this.notepadService.notes;
  saveStatus = this.notepadService.saveStatus;

  onInput(event: Event) {
    this.notepadService.updateNotes((event.target as HTMLTextAreaElement).value);
  }

  exportNotes() {
    const blob = new Blob([this.notes()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notes.txt';
    link.click();
    URL.revokeObjectURL(url);
  }
}
