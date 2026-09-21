import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gn-field">
      <label>{{ label }}</label>
      <div class="gn-input-wrap">
        <svg class="gn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="iconPath"></svg>
        <input [type]="type" [placeholder]="placeholder" [ngModel]="model" (ngModelChange)="modelChange.emit($event)" [spellcheck]="spellcheck">
      </div>
    </div>
  `,
  styles: [`
    .gn-field { display:flex; flex-direction:column; gap:6px; }
    .gn-field label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#777; font-weight:500; }
    .gn-input-wrap { position:relative; display:flex; align-items:center; }
    .gn-ico { position:absolute; left:16px; width:18px; height:18px; color:#444; pointer-events:none; transition:color 0.3s; }
    .gn-input-wrap input { width:100%; padding:16px 18px 16px 48px; background:rgba(14,14,24,0.6); border:1px solid rgba(255,255,255,0.07); border-radius:10px; color:#e0e0ea; font-family:'JetBrains Mono',monospace; font-size:14px; outline:none; transition:all 0.3s; }
    .gn-input-wrap input::placeholder { color:#333; font-size:13px; }
    .gn-input-wrap input:focus { background:rgba(18,18,30,0.8); border-color:#DD0031; box-shadow:0 0 0 3px rgba(221,0,49,0.1), 0 0 20px rgba(221,0,49,0.05); }
    .gn-input-wrap:focus-within .gn-ico { color:#DD0031; }
  `]
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() iconPath = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() model = '';
  @Input() spellcheck = true;
  @Output() modelChange = new EventEmitter<string>();
}