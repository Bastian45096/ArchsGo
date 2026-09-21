import { Component, inject, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopStateService, InstalledApp } from '../services/desktop-state.service';

interface DesktopIcon {
  id: string;
  label: string;
  type: 'terminal' | 'archtx' | 'app';
  appName?: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-desktop-icons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="desk">
      @for (icon of icons; track icon.id) {
        <button class="dicon"
                [class.dragging]="draggingId === icon.id"
                [style.left.px]="icon.x"
                [style.top.px]="icon.y"
                (mousedown)="onMouseDown($event, icon)"
                (dblclick)="onDblClick(icon)">
          <div class="di-box" [ngClass]="getIconClass(icon)">
            <!-- SVG TERMINAL -->
            <svg *ngIf="icon.type === 'terminal'" viewBox="0 0 52 52" fill="none">
              <rect x="4" y="6" width="44" height="40" rx="5" fill="#0e0e18" stroke="#28c840" stroke-width="2.5"/>
              <rect x="4" y="6" width="44" height="9" rx="5" fill="rgba(40,200,64,0.1)"/>
              <circle cx="12" cy="11" r="2.5" fill="#ff5f57"/>
              <circle cx="19" cy="11" r="2.5" fill="#febc2e"/>
              <circle cx="26" cy="11" r="2.5" fill="#28c840"/>
              <polyline points="15,26 22,33 15,40" stroke="#28c840" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="26" y1="40" x2="38" y2="40" stroke="#28c840" stroke-width="3" stroke-linecap="round"/>
            </svg>

            <!-- SVG ARCHTX -->
            <svg *ngIf="icon.type === 'archtx'" viewBox="0 0 52 52" fill="none">
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#DD0031"/>
                  <stop offset="50%" stop-color="#a040b0"/>
                  <stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
              </defs>
              <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#grad1)" stroke-width="2"/>
              <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="26" cy="26" r="4" fill="none" stroke="url(#grad1)" stroke-width="2"/>
            </svg>

            <!-- SVG GONET -->
            <svg *ngIf="icon.appName === 'gonet'" viewBox="0 0 52 52" fill="none">
              <defs>
                <linearGradient id="gnMain" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#DD0031"/>
                  <stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
                <linearGradient id="gnVert" x1="26" y1="4" x2="26" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#DD0031"/>
                  <stop offset="40%" stop-color="#c02070"/>
                  <stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
                <filter id="gnGlow">
                  <feGaussianBlur stdDeviation="1.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <clipPath id="gnClip"><circle cx="26" cy="26" r="22"/></clipPath>
              </defs>
              <circle cx="26" cy="26" r="23" fill="#08080e"/>
              <circle cx="26" cy="26" r="23" fill="none" stroke="#DD0031" stroke-width="2.5" stroke-dasharray="30 18" stroke-dashoffset="0" stroke-linecap="round" opacity="0.9"/>
              <circle cx="26" cy="26" r="23" fill="none" stroke="#DD0031" stroke-width="2.5" stroke-dasharray="30 18" stroke-dashoffset="-48" stroke-linecap="round" opacity="0.6"/>
              <circle cx="26" cy="26" r="23" fill="none" stroke="#1793D1" stroke-width="2.5" stroke-dasharray="30 18" stroke-dashoffset="-96" stroke-linecap="round" opacity="0.9"/>
              <circle cx="26" cy="4" r="3" fill="#DD0031" filter="url(#gnGlow)"><animate attributeName="r" values="2.5;3.5;2.5" dur="3s" repeatCount="indefinite"/></circle>
              <circle cx="6" cy="40" r="3" fill="#DD0031" opacity="0.7"><animate attributeName="r" values="2.5;3.5;2.5" dur="3.5s" begin="1s" repeatCount="indefinite"/></circle>
              <circle cx="46" cy="40" r="3" fill="#1793D1" opacity="0.7"><animate attributeName="r" values="2.5;3.5;2.5" dur="3.5s" begin="2s" repeatCount="indefinite"/></circle>
              <g clip-path="url(#gnClip)">
                <path d="M26 8 L44 42 L8 42 Z" fill="none" stroke="url(#gnVert)" stroke-width="2" opacity="0.8"/>
                <path d="M26 16 L37 40 L15 40 Z" fill="url(#gnVert)" opacity="0.15"/>
                <path d="M26 46 L26 8" stroke="url(#gnMain)" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
                <path d="M20 20 L26 8 L32 20" stroke="#DD0031" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9" filter="url(#gnGlow)"/>
                <path d="M14 38 L18 28" stroke="#1793D1" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
                <path d="M38 38 L34 28" stroke="#DD0031" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
                <circle cx="20" cy="38" r="1" fill="#DD0031" opacity="0.5"><animate attributeName="cy" values="38;10;38" dur="4s" repeatCount="indefinite"/></circle>
                <circle cx="32" cy="40" r="1" fill="#1793D1" opacity="0.5"><animate attributeName="cy" values="40;12;40" dur="4.5s" begin="1s" repeatCount="indefinite"/></circle>
                <circle cx="26" cy="42" r="0.8" fill="url(#gnMain)" opacity="0.6"><animate attributeName="cy" values="42;8;42" dur="3.5s" begin="0.5s" repeatCount="indefinite"/></circle>
              </g>
              <circle cx="26" cy="8" r="1.5" fill="#fff" opacity="0.2"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></circle>
            </svg>

            <!-- SVG DEFAULT -->
            <span *ngIf="icon.type === 'app' && icon.appName !== 'gonet'" class="di-letter">{{ icon.label.charAt(0) }}</span>
          </div>
          <span class="icon-label">{{ icon.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display:block; }
    .desk {
      position:absolute; top:48px; left:0; right:0; bottom:0;
      z-index:10; overflow:hidden;
    }
    .dicon {
      position:absolute;
      display:flex; flex-direction:column; align-items:center; gap:8px;
      background:transparent;
      border:1px solid transparent;
      cursor:pointer; border-radius:14px; padding:14px 18px;
      transition:background 0.15s, border-color 0.15s;
      width:96px; user-select:none;
    }
    .dicon:hover {
      background:rgba(255,255,255,0.05);
      border-color:rgba(255,255,255,0.08);
    }
    .dicon.dragging {
      opacity:0.5;
      border-color:rgba(221,0,49,0.5);
      box-shadow:0 0 25px rgba(221,0,49,0.2);
      cursor:grabbing;
      transition:none;
    }
    .di-box {
      width:56px; height:56px; border-radius:12px;
      display:flex; align-items:center; justify-content:center;
      padding:4px; pointer-events:none;
    }
    .di-box svg { width:100%; height:100%; display:block; pointer-events:none; }
    .di-term { background:transparent; border:1px solid transparent; }
    .di-arch { background:transparent; border:1px solid transparent; }
    .di-gonet { background:transparent; border:1px solid transparent; }
    .di-default { background:transparent; border:1px solid transparent; }
    .di-letter {
      font-family:'Chakra Petch',sans-serif; font-size:22px; font-weight:700;
      background:linear-gradient(135deg,#DD0031,#1793D1);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      pointer-events:none;
    }
    .icon-label {
      font-family:'Chakra Petch',sans-serif; font-size:11px; text-align:center;
      text-shadow:0 2px 8px rgba(0,0,0,1); font-weight:600;
      letter-spacing:0.5px; color:#e0e0ea; pointer-events:none;
    }
  `]
})
export class DesktopIconsComponent implements OnInit {
  state = inject(DesktopStateService);

  icons: DesktopIcon[] = [];

  draggingId: string | null = null;
  dragStartX = 0;
  dragStartY = 0;
  iconStartX = 0;
  iconStartY = 0;
  isDragging = false;

  private readonly ICON_H = 100;
  private readonly MARGIN_TOP = 56;
  private readonly MARGIN_LEFT = 20;

  private appsEffect = effect(() => {
    const apps = this.state.installedApps();
    const saved = this.state.iconPositions();
    this.buildIcons(apps, saved);
  });

  ngOnInit(): void {
    this.state.loadIconPositions();
    this.state.loadInstalledApps();
  }

  buildIcons(apps: InstalledApp[], saved: Record<string, { x: number; y: number }>): void {
    const result: DesktopIcon[] = [
      this.makeIcon('terminal', 'Terminal', 'terminal', 0, saved),
      this.makeIcon('archtx', 'ArchTX', 'archtx', 1, saved),
    ];

    apps.forEach((app, i) => {
      const appId = 'app-' + app.id;
      result.push(this.makeIcon(appId, app.nombre, 'app', i + 2, saved, app.nombre.toLowerCase()));
    });

    this.icons = result;
  }

  private makeIcon(id: string, label: string, type: 'terminal' | 'archtx' | 'app', index: number,
                   saved: Record<string, { x: number; y: number }>, appName?: string): DesktopIcon {
    const pos = saved[id];
    const x = pos ? pos.x : this.MARGIN_LEFT;
    const y = pos ? pos.y : this.MARGIN_TOP + index * (this.ICON_H + 12);
    return { id, label, type, appName, x, y };
  }

  onMouseDown(e: MouseEvent, icon: DesktopIcon): void {
    e.preventDefault();
    this.draggingId = icon.id;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.iconStartX = icon.x;
    this.iconStartY = icon.y;
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.draggingId) return;

    const dx = e.clientX - this.dragStartX;
    const dy = e.clientY - this.dragStartY;

    if (!this.isDragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      this.isDragging = true;
    }

    if (this.isDragging) {
      const newX = this.snap(this.iconStartX + dx);
      const newY = this.snap(this.iconStartY + dy);

      const icon = this.icons.find(i => i.id === this.draggingId);
      if (icon) {
        icon.x = newX;
        icon.y = newY;
      }
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.draggingId && this.isDragging) {
      const icon = this.icons.find(i => i.id === this.draggingId);
      if (icon) {
        this.state.saveIconPosition(icon.id, icon.x, icon.y);
      }
    }
    this.draggingId = null;
    this.isDragging = false;
  }

  onDblClick(icon: DesktopIcon): void {
    if (this.isDragging) return;
    if (icon.type === 'terminal') this.state.open('terminal');
    else if (icon.type === 'archtx') this.state.open('archtx');
    else if (icon.appName === 'gonet') this.state.open('gonet');
  }

  snap(val: number): number {
    return Math.round(val / 12) * 12;
  }

  getIconClass(icon: DesktopIcon): string {
    if (icon.type === 'terminal') return 'di-term';
    if (icon.type === 'archtx') return 'di-arch';
    if (icon.appName === 'gonet') return 'di-gonet';
    return 'di-default';
  }
}