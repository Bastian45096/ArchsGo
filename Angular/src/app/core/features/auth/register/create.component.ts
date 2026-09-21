import { Component } from '@angular/core';
import { LeftPanelComponent } from './components/left-panel.component';
import { RegisterFormComponent } from './components/register-form.component';
import { RegisterModalComponent } from './components/register-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [LeftPanelComponent, RegisterFormComponent, RegisterModalComponent],
  template: `
    <div class="page">
      <div class="scanlines"></div>
      <app-register-left-panel></app-register-left-panel>
      <app-register-form></app-register-form>
    </div>
    <app-register-modal></app-register-modal>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

    :host { display:block; width:100%; height:100vh; background:#060608; overflow:hidden; }
    * { margin:0; padding:0; box-sizing:border-box; }

    .page { font-family:'Chakra Petch',sans-serif; background:#060608; color:#dcdce4; height:100vh; display:flex; overflow:hidden; }
    .scanlines { position:fixed; inset:0; pointer-events:none; z-index:999; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.012) 2px,rgba(0,0,0,0.012) 4px); }

    @media (max-width:960px) {
      .page { flex-direction:column; overflow-y:auto; }
    }
  `]
})
export class RegisterComponent {}