import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gn-avatar-section">
      <div class="gn-avatar-wrap" (click)="fileInput.click()">
        <div class="gn-avatar-placeholder" *ngIf="!preview()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Subir foto</span>
        </div>
        <img *ngIf="preview()" [src]="preview()" alt="avatar" class="gn-avatar-img">
        <div class="gn-avatar-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      </div>
      <input type="file" #fileInput accept="image/*" (change)="onSelect($event)" style="display:none">
      <span class="gn-avatar-label">Foto de perfil (opcional)</span>
    </div>
  `,
  styles: [`
    .gn-avatar-section { display:flex; flex-direction:column; align-items:center; gap:10px; margin-bottom:4px; }
    .gn-avatar-wrap { width:80px; height:80px; border-radius:50%; cursor:pointer; position:relative; overflow:hidden; border:2px dashed rgba(255,255,255,0.1); transition:all 0.3s; }
    .gn-avatar-wrap:hover { border-color:#DD0031; box-shadow:0 0 20px rgba(221,0,49,0.15); }
    .gn-avatar-placeholder { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; background:rgba(14,14,24,0.6); }
    .gn-avatar-placeholder svg { width:24px; height:24px; color:#444; }
    .gn-avatar-placeholder span { font-size:8px; color:#444; letter-spacing:1px; text-transform:uppercase; }
    .gn-avatar-img { width:100%; height:100%; object-fit:cover; }
    .gn-avatar-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s; }
    .gn-avatar-wrap:hover .gn-avatar-overlay { opacity:1; }
    .gn-avatar-label { font-family:'JetBrains Mono',monospace; font-size:10px; color:#555; letter-spacing:1px; }
  `]
})
export class AvatarUploaderComponent {
  @Input() preview = signal<string>('');
  @Output() previewChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string>();

  onSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) { this.errorChange.emit('Solo se permiten imagenes'); return; }
      if (file.size > 5 * 1024 * 1024) { this.errorChange.emit('La imagen no puede pesar mas de 5MB'); return; }
      const reader = new FileReader();
      reader.onload = (e) => { this.previewChange.emit(e.target?.result as string); };
      reader.readAsDataURL(file);
    }
  }
}