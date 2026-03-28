import { useEffect, useRef } from 'react';

export default function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.0015;
      
      // Clear with dark base
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#050A03';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'screen';

      const centers = [
        { x: canvas.width * 0.3 + Math.sin(time) * 200, y: canvas.height * 0.4 + Math.cos(time * 0.8) * 150, r: 800, c1: 'rgba(163,230,53,0.05)', c2: 'rgba(74,124,2,0)' },
        { x: canvas.width * 0.7 + Math.cos(time * 1.2) * 300, y: canvas.height * 0.6 + Math.sin(time * 0.9) * 200, r: 900, c1: 'rgba(217,119,6,0.06)', c2: 'rgba(146,64,14,0)' },
        { x: canvas.width * 0.5 + Math.sin(time * 0.5) * 400, y: canvas.height * 0.8 + Math.cos(time * 1.5) * 100, r: 1000, c1: 'rgba(26,42,10,0.12)', c2: 'rgba(10,15,5,0)' },
        { x: canvas.width * 0.8 + Math.sin(time * 1.1) * 250, y: canvas.height * 0.2 + Math.cos(time * 0.7) * 250, r: 600, c1: 'rgba(132,204,22,0.04)', c2: 'rgba(74,124,2,0)' },
        { x: canvas.width * 0.2 + Math.cos(time * 1.3) * 200, y: canvas.height * 0.8 + Math.sin(time * 1.4) * 300, r: 700, c1: 'rgba(146,64,14,0.07)', c2: 'rgba(217,119,6,0)' },
      ];

      for (let i = 0; i < centers.length; i++) {
        const c = centers[i];
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        g.addColorStop(0, c.c1);
        g.addColorStop(1, c.c2);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vortex arms (swirls)
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 8; i++) {
        const offset = i * (Math.PI / 4) + time * 0.3;
        const cx = canvas.width / 2 + Math.cos(offset) * 200;
        const cy = canvas.height / 2 + Math.sin(offset) * 200;
        const ex = cx + Math.cos(offset + Math.PI/1.5) * (canvas.width * 0.8);
        const ey = cy + Math.sin(offset + Math.PI/1.5) * (canvas.height * 0.8);
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(163,230,53,0.015)' : 'rgba(217,119,6,0.01)';
        ctx.lineWidth = 150 + Math.sin(time + i) * 60;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} />;
}
