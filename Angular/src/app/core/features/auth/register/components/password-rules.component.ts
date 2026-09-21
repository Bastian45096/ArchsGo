import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterStateService } from '../services/register-state.service';

@Component({
  selector: 'app-password-rules',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rules" [class.visible]="state.password.length > 0">
      <div class="rule" [class.pass]="state.ruleLength">
        <div class="rule-icon">
          @if (state.ruleLength) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
          }
        </div>
        <span>M&iacute;nimo 8 caracteres</span>
        <div class="rule-bar"><div class="rule-fill" [style.width.%]="state.lengthProgress"></div></div>
      </div>

      <div class="rule" [class.pass]="state.ruleUppercase">
        <div class="rule-icon">
          @if (state.ruleUppercase) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
          }
        </div>
        <span>Al menos 1 may&uacute;scula</span>
        <div class="rule-bar"><div class="rule-fill" [style.width.%]="state.ruleUppercase ? 100 : 0"></div></div>
      </div>

      <div class="rule" [class.pass]="state.ruleNumbers">
        <div class="rule-icon">
          @if (state.ruleNumbers) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
          }
        </div>
        <span>Al menos 2 n&uacute;meros</span>
        <div class="rule-bar"><div class="rule-fill" [style.width.%]="state.numbersProgress"></div></div>
      </div>

      <div class="rule" [class.pass]="state.ruleSpecial">
        <div class="rule-icon">
          @if (state.ruleSpecial) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
          }
        </div>
        <span>1 car&aacute;cter especial (!&#64;#$...)</span>
        <div class="rule-bar"><div class="rule-fill" [style.width.%]="state.ruleSpecial ? 100 : 0"></div></div>
      </div>

      <div class="strength">
        <div class="str-label">Fortaleza:</div>
        <div class="str-bars">
          <div class="str-bar" [class.active]="state.strength >= 1" [class.weak]="state.strength === 1" [class.mid]="state.strength >= 2" [class.strong]="state.strength >= 4"></div>
          <div class="str-bar" [class.active]="state.strength >= 2" [class.mid]="state.strength >= 2" [class.strong]="state.strength >= 4"></div>
          <div class="str-bar" [class.active]="state.strength >= 3" [class.mid]="state.strength === 3" [class.strong]="state.strength >= 4"></div>
          <div class="str-bar" [class.active]="state.strength >= 4" [class.strong]="state.strength >= 4"></div>
        </div>
        <span class="str-text" [class.weak]="state.strength === 1" [class.mid]="state.strength === 2 || state.strength === 3" [class.strong]="state.strength >= 4">
          {{ state.strengthLabel }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .rules { margin-top:12px; padding:14px; background:rgba(0,0,0,0.25); border-radius:8px; border:1px solid rgba(255,255,255,0.03); max-height:0; overflow:hidden; opacity:0; transition:max-height 0.5s cubic-bezier(0.16,1,0.3,1),opacity 0.4s ease,margin-top 0.4s ease,padding 0.4s ease; margin-top:0; padding:0 14px; }
    .rules.visible { max-height:300px; opacity:1; margin-top:12px; padding:14px; }
    .rule { display:flex; align-items:center; gap:8px; margin-bottom:8px; transition:all 0.3s ease; }
    .rule:last-of-type { margin-bottom:0; }
    .rule-icon { width:16px; height:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rule-icon svg { width:14px; height:14px; color:#2a2a38; transition:all 0.3s ease; }
    .rule.pass .rule-icon svg { color:#28c840; filter:drop-shadow(0 0 4px rgba(40,200,64,0.4)); }
    .rule span { font-family:'JetBrains Mono',monospace; font-size:11px; color:#3a3a48; flex:1; transition:color 0.3s ease; }
    .rule.pass span { color:#7a7a88; }
    .rule-bar { width:40px; height:3px; background:rgba(255,255,255,0.04); border-radius:2px; overflow:hidden; flex-shrink:0; }
    .rule-fill { height:100%; border-radius:2px; background:#2a2a38; transition:width 0.4s cubic-bezier(0.16,1,0.3,1),background 0.3s ease; width:0%; }
    .rule.pass .rule-fill { background:#28c840; box-shadow:0 0 6px rgba(40,200,64,0.3); }
    .strength { display:flex; align-items:center; gap:10px; margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.03); }
    .str-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#2a2a38; }
    .str-bars { display:flex; gap:3px; }
    .str-bar { width:24px; height:4px; border-radius:2px; background:rgba(255,255,255,0.04); transition:all 0.4s ease; }
    .str-bar.active.weak { background:#DD0031; box-shadow:0 0 6px rgba(221,0,49,0.3); }
    .str-bar.active.mid { background:#febc2e; box-shadow:0 0 6px rgba(254,188,46,0.3); }
    .str-bar.active.strong { background:#28c840; box-shadow:0 0 6px rgba(40,200,64,0.3); }
    .str-text { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:1px; text-transform:uppercase; color:#2a2a38; transition:color 0.3s; }
    .str-text.weak { color:#DD0031; }
    .str-text.mid { color:#febc2e; }
    .str-text.strong { color:#28c840; }
  `]
})
export class PasswordRulesComponent {
  state = inject(RegisterStateService);
}