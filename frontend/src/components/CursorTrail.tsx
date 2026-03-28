import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trail = useRef<{x: number, y: number, t: number, jitterX: number, jitterY: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = ['#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#3F6212'];
    const highlightColors = ['#ECFCCB', '#D9F99D', '#A3E635'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      if (cursorDotRef.current) {
        // Direct DOM update for 0 lag tip
        cursorDotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }

      trail.current.unshift({
        x: e.clientX,
        y: e.clientY,
        t: Date.now(),
        jitterX: (Math.random() - 0.5) * 16,
        jitterY: (Math.random() - 0.5) * 16
      });
      if (trail.current.length > 40) {
        trail.current.pop();
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      // Fluid blob trail
      ctx.globalCompositeOperation = 'screen';
      trail.current.forEach((p, i) => {
        const age = now - p.t;
        if (age > 600 || i >= 25) return;
        
        const progress = i / 25;
        const size = Math.max(0, 28 * (1 - progress));
        const color = colors[i % colors.length];
        const opacity = 0.15 * (1 - progress);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Highlight specks
      ctx.globalCompositeOperation = 'source-over';
      trail.current.forEach((p, i) => {
        const age = now - p.t;
        if (age > 600 || i >= 15) return;
        
        const progress = i / 15;
        const color = highlightColors[i % highlightColors.length];
        const opacity = 0.6 * (1 - progress);
        const size = 2 + (i % 4);

        ctx.beginPath();
        ctx.arc(p.x + p.jitterX, p.y + p.jitterY, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }} />
      <div 
        ref={cursorDotRef} 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '8px', height: '8px', 
          backgroundColor: '#A3E635', borderRadius: '50%', boxShadow: '0 0 10px rgba(163,230,53,0.8)', 
          zIndex: 9999, pointerEvents: 'none', willChange: 'transform' 
        }} 
      />
    </>
  );
}
