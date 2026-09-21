import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

interface Particle { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number; }
interface Node { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; r: number; phase: number; }

@Component({
  selector: 'app-particle-canvas',
  standalone: true,
  template: `<canvas #canvas class="gn-canvas"></canvas>`,
  styles: [`.gn-canvas { position:absolute; inset:0; width:100%; height:100%; z-index:1; }`]
})
export class ParticleCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() mode: 'nodes' | 'particles' = 'nodes';
  private animId: number | null = null;

  ngAfterViewInit(): void {
    if (this.mode === 'nodes') this.drawNodes();
    else this.drawParticles();
  }

  ngOnDestroy(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
  }

  private drawNodes(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes: Node[] = [];
    const count = Math.min(50, Math.floor(canvas.width * canvas.height / 8000));
    for (let i = 0; i < count; i++) {
      const bx = Math.random() * canvas.width;
      const by = Math.random() * canvas.height;
      nodes.push({ x: bx, y: by, baseX: bx, baseY: by, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 1, phase: Math.random() * Math.PI * 2 });
    }
    let time = 0;
    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hexSize = 40;
      for (let row = 0; row < canvas.height / (hexSize * 1.5) + 1; row++) {
        for (let col = 0; col < canvas.width / (hexSize * 1.73) + 1; col++) {
          const cx = col * hexSize * 1.73 + (row % 2 ? hexSize * 0.866 : 0);
          const cy = row * hexSize * 1.5;
          const distCenter = Math.sqrt(Math.pow(cx - canvas.width / 2, 2) + Math.pow(cy - canvas.height / 2, 2));
          const maxDist = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
          const opacity = Math.max(0, (1 - distCenter / maxDist) * 0.04);
          const pulse = Math.sin(time * 2 + distCenter * 0.005) * 0.02;
          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const angle = (Math.PI / 3) * s - Math.PI / 6;
            const hx = cx + hexSize * 0.4 * Math.cos(angle);
            const hy = cy + hexSize * 0.4 * Math.sin(angle);
            if (s === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(221,0,49,${opacity + pulse})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        n.x += n.vx + Math.sin(time + n.phase) * 0.2;
        n.y += n.vy + Math.cos(time * 0.7 + n.phase) * 0.2;
        if (n.x < -20) n.x = canvas.width + 20;
        if (n.x > canvas.width + 20) n.x = -20;
        if (n.y < -20) n.y = canvas.height + 20;
        if (n.y > canvas.height + 20) n.y = -20;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.12;
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, `rgba(221,0,49,${opacity})`);
            gradient.addColorStop(0.5, `rgba(192,32,112,${opacity * 0.7})`);
            gradient.addColorStop(1, `rgba(23,147,209,${opacity})`);
            ctx.beginPath(); ctx.strokeStyle = gradient; ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const glow = 0.5 + Math.sin(time * 3 + n.phase) * 0.3;
        const isRed = n.phase > Math.PI;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isRed ? `rgba(221,0,49,${glow})` : `rgba(23,147,209,${glow})`;
        ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = isRed ? `rgba(221,0,49,${glow * 0.1})` : `rgba(23,147,209,${glow * 0.1})`;
        ctx.fill();
      }
      this.animId = requestAnimationFrame(draw);
    };
    draw();
  }

  private drawParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles: Particle[] = [];
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 6000));
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, r: Math.random() * 2 + 0.5, color: Math.random() > 0.5 ? '#DD0031' : '#1793D1', alpha: Math.random() * 0.5 + 0.2 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.15;
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            gradient.addColorStop(0, `rgba(221,0,49,${opacity})`);
            gradient.addColorStop(0.5, `rgba(192,32,112,${opacity})`);
            gradient.addColorStop(1, `rgba(23,147,209,${opacity})`);
            ctx.beginPath(); ctx.strokeStyle = gradient; ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
      }
      this.animId = requestAnimationFrame(draw);
    };
    draw();
  }
}