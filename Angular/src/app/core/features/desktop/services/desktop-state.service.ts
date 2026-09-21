import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface InstalledApp {
  id: number;
  nombre: string;
  descripcion: string;
  version: string;
  categoria: string;
  estaInstalada: boolean;
  fuente: string;
}

export interface Win {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
}

export interface TermLine {
  t: string;
  v: string;
}

@Injectable({ providedIn: 'root' })
export class DesktopStateService {

  constructor(private http: HttpClient) {}

  // ═══ INSTALLED APPS ═══
  installedApps = signal<InstalledApp[]>([]);

  loadInstalledApps(): void {
    this.http.get<any[]>('http://localhost:8080/api/aplicaciones').subscribe({
      next: (apps) => {
        this.installedApps.set(apps.filter((a: any) => a.estaInstalada));
      },
      error: () => {}
    });
  }

  refreshApps(): void {
    this.loadInstalledApps();
  }

  // ═══ ICON POSITIONS ═══
  iconPositions = signal<Record<string, { x: number; y: number }>>({});

  saveIconPosition(id: string, x: number, y: number): void {
    const positions = { ...this.iconPositions() };
    positions[id] = { x, y };
    this.iconPositions.set(positions);
    localStorage.setItem('iconPositions', JSON.stringify(positions));
  }

  loadIconPositions(): void {
    const saved = localStorage.getItem('iconPositions');
    if (saved) {
      try {
        this.iconPositions.set(JSON.parse(saved));
      } catch {}
    }
  }

  getIconPosition(id: string): { x: number; y: number } | null {
    return this.iconPositions()[id] || null;
  }

  resetIconPositions(): void {
    this.iconPositions.set({});
    localStorage.removeItem('iconPositions');
  }

  // ═══ WINDOWS ═══
  wins = signal<Win[]>([]);
  private z = 100;
  private dg: { id: string; ox: number; oy: number } | null = null;

  // ═══ TOPBAR ═══
  clk = signal('');
  pwr = signal(false);
  activeTitle = computed(() => {
    const w = this.wins();
    if (!w.length) return '';
    const t = w.reduce((a, b) => a.z > b.z ? a : b);
    return t.min ? '' : t.title;
  });

  // ═══ LAUNCHER ═══
  launcher = signal(false);

  // ═══ CONTEXT MENU ═══
  ctx = signal({ s: false, x: 0, y: 0 });

  // ═══ NOTIFICATION ═══
  ntf = signal({ s: false, t: '', m: '' });

  // ═══ TERMINAL ═══
  tLines = signal<TermLine[]>([
    { t: 'o', v: '<span style="color:#DD0031">Arch</span><span style="color:#1793D1">sGo</span> <span style="color:#666">Linux 2.0 LTS (Kernel 6.10.2)</span>' },
    { t: 'o', v: '<span style="color:#666">\u00daltimo login: ' + new Date().toLocaleString() + '</span>' },
    { t: 'o', v: '' },
  ]);

  // ═══ WINDOW METHODS ═══
  open(id: string): void {
    const ex = this.wins().find(w => w.id === id);
    if (ex) {
      if (ex.min) {
        this.wins.set(this.wins().map(w =>
          w.id === id ? { ...w, min: false, z: ++this.z } : w
        ));
      } else {
        this.focus(id);
      }
      return;
    }
    const c: Record<string, any> = {
      terminal: { title: 'Terminal', w: 640, h: 420 },
      archtx: { title: 'ArchTX', w: 800, h: 520 },
      gonet: { title: 'GoNET', w: 960, h: 640 },
    };
    const cfg = c[id] || { title: id, w: 500, h: 400 };
    const o = this.wins().length * 30;
    this.wins.set([...this.wins(), {
      id, title: cfg.title,
      x: 100 + o, y: 50 + o,
      w: cfg.w, h: cfg.h,
      z: ++this.z, min: false, max: false
    }]);
  }

  close(id: string): void {
    this.wins.set(this.wins().filter(w => w.id !== id));
  }

  mini(id: string): void {
    this.wins.set(this.wins().map(w =>
      w.id === id ? { ...w, min: true } : w
    ));
  }

  toggMax(id: string): void {
    this.wins.set(this.wins().map(w =>
      w.id === id ? { ...w, max: !w.max, z: ++this.z } : w
    ));
  }

  focus(id: string): void {
    this.wins.set(this.wins().map(w =>
      w.id === id ? { ...w, z: ++this.z } : w
    ));
  }

  isOpen(id: string): boolean {
    return this.wins().some(w => w.id === id);
  }

  // ═══ DRAG ═══
  dragStart(e: MouseEvent, id: string): void {
    const w = this.wins().find(w => w.id === id);
    if (!w || w.max) return;
    this.dg = { id, ox: e.clientX - w.x, oy: e.clientY - w.y };
    this.focus(id);
  }

  dragMove(e: MouseEvent): void {
    if (this.dg) {
      this.wins.set(this.wins().map(w =>
        w.id === this.dg!.id && !w.max
          ? { ...w, x: e.clientX - this.dg!.ox, y: Math.max(32, e.clientY - this.dg!.oy) }
          : w
      ));
    }
  }

  dragEnd(): void {
    this.dg = null;
  }

  // ═══ NOTIFICATION ═══
  showNtf(t: string, m: string): void {
    this.ntf.set({ s: true, t, m });
    setTimeout(() => this.ntf.set({ s: false, t: '', m: '' }), 5000);
  }

  // ═══ CONTEXT MENU ═══
  ctxOpen(e: MouseEvent): void {
    e.preventDefault();
    this.ctx.set({ s: true, x: e.clientX, y: e.clientY });
  }

  ctxClose(): void {
    this.ctx.set({ s: false, x: 0, y: 0 });
  }
}