import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DesktopStateService } from '../../services/desktop-state.service';

@Component({
  selector: 'app-terminal-app',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  template: `
    <div class="term">
      <div class="tout" #termOutput>
        @for (l of state.tLines(); track $index) {
          <div class="tl" [class.tl-o]="l.t==='o'" [class.tl-e]="l.t==='e'" [class.tl-s]="l.t==='s'">
            @if (l.t==='p') {
              <span class="tu">archsgo</span><span class="tc">:</span><span class="tp">~</span><span class="td">$ </span>
            }
            <span [innerHTML]="l.v"></span>
          </div>
        }
      </div>
      <div class="tinp">
        <span class="tu">archsgo</span><span class="tc">:</span><span class="tp">~</span><span class="td">$ </span>
        <input [(ngModel)]="tInp" (keydown.enter)="runCmd()" spellcheck="false" autocomplete="off">
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; height:100%; }
    .term { height:100%; display:flex; flex-direction:column; background:#08080e; }
    .tout { flex:1; overflow-y:auto; padding:12px 14px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; }
    .tout::-webkit-scrollbar { width:6px; }
    .tout::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:3px; }
    .tl { white-space:pre-wrap; word-break:break-all; }
    .tu { color:#28c840; }
    .tc { color:#666; }
    .tp { color:#1793D1; }
    .td { color:#e0e0ea; }
    .tl-o { color:#aaa; }
    .tl-e { color:#DD0031; }
    .tl-s { color:#28c840; }
    .tinp { display:flex; align-items:center; padding:8px 14px 12px; font-family:'JetBrains Mono',monospace; font-size:12px; border-top:1px solid rgba(255,255,255,0.04); }
    .tinp input { flex:1; background:none; border:none; color:#e0e0ea; font-family:'JetBrains Mono',monospace; font-size:12px; outline:none; caret-color:#28c840; }
  `]
})
export class TerminalAppComponent {
  state = inject(DesktopStateService);
  http = inject(HttpClient);
  tInp = '';
  private apiUrl = 'http://localhost:8080/api';

  runCmd(): void {
    const cmd = this.tInp.trim();
    if (!cmd) return;

    const ls = [...this.state.tLines(), { t: 'p' as string, v: cmd }];
    this.state.tLines.set(ls);
    this.tInp = '';

    if (cmd === 'clear') {
      this.state.tLines.set([]);
      return;
    }

    const userId = this.getUserId();

    this.http.post<any>(`${this.apiUrl}/terminal/execute`, {
      comando: cmd,
      usuarioId: userId
    }).subscribe({
      next: (res) => {
        if (res.salida === '[CLEAR]') {
          this.state.tLines.set([]);
          return;
        }

        const newLines = [...this.state.tLines()];
        const lineas = res.salida.split('\n');

        for (const linea of lineas) {
          const tipo = res.codigoSalida === 0 ? 'o' : 'e';
          newLines.push({ t: tipo, v: this.colorize(linea) });
        }

        newLines.push({ t: 'o', v: '' });
        this.state.tLines.set(newLines);

        // Refrescar iconos del desktop despues de instalar/desinstalar
        this.state.refreshApps();

        this.scrollToBottom();
      },
      error: (err) => {
        const newLines = [...this.state.tLines()];
        newLines.push({ t: 'e', v: 'Error: No se pudo conectar al servidor' });
        newLines.push({ t: 'o', v: '' });
        this.state.tLines.set(newLines);
      }
    });
  }

  private getUserId(): number {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return 1;
      const user = JSON.parse(raw);
      const id = Number(user.userId);
      return isNaN(id) || id === 0 ? 1 : id;
    } catch {
      return 1;
    }
  }

  private colorize(text: string): string {
    let s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    s = s.replace(/$$OK$$/g, '<span style="color:#28c840">[OK]</span>');
    s = s.replace(/$$goarch$$/g, '<span style="color:#1793D1">[goarch]</span>');
    s = s.replace(/GoNET/g, '<span style="color:#DD0031">Go</span><span style="color:#5865F2">NET</span>');
    s = s.replace(/v(\d+\.\d+\.\d+)/g, '<span style="color:#a040b0">v$1</span>');
    s = s.replace(/(archcore|archruntime|archdev|archsec|archdata|archserver|archtails|archgommunity)/g,
      '<span style="color:#faa61a">$1</span>');
    s = s.replace(/\bOK\b/g, '<span style="color:#28c840">OK</span>');
    s = s.replace(/\blisto\b/g, '<span style="color:#28c840">listo</span>');

    return s;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.tout');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}