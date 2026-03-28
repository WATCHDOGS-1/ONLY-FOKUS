import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const colors = ['#DC2626', '#F59E0B', '#9333EA', '#EC4899', '#84CC16', '#FF6B6B', '#FFB347'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 300; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5, // 0.5px to 3px
          opacity: Math.random() * 0.7 + 0.1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulseOffset: Math.random() * Math.PI * 2,
          isBig: Math.random() < 0.15 // 15% are large bokeh orbs
        });
      }
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentOpacity = p.opacity + Math.sin((time * 0.001) + p.pulseOffset) * 0.3;
        const clampedOpacity = Math.max(0, Math.min(1, currentOpacity));

        ctx.beginPath();
        if (p.isBig) {
          const bigSize = p.size * 4; // 2 to 12px
          ctx.arc(p.x, p.y, bigSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = clampedOpacity * 0.5; // Softer opacity for bokeh
          ctx.shadowBlur = 20;
          ctx.shadowColor = p.color;
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = clampedOpacity;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.globalAlpha = 1; // Reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Layer 1 - Swirling Nebula Orbs */}
      <div 
        className="animate-float-1" 
        style={{ position: 'absolute', top: '-200px', left: '-200px', width: '700px', height: '700px', backgroundColor: '#9333EA', opacity: 0.12, filter: 'blur(120px)', borderRadius: '50%' }} 
      />
      <div 
        className="animate-float-2" 
        style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', backgroundColor: '#F59E0B', opacity: 0.10, filter: 'blur(100px)', borderRadius: '50%' }} 
      />
      <div 
        className="animate-float-3" 
        style={{ position: 'absolute', top: '30%', left: '60%', width: '400px', height: '400px', backgroundColor: '#DC2626', opacity: 0.08, filter: 'blur(90px)', borderRadius: '50%' }} 
      />
      <div 
        className="animate-float-1-reverse" 
        style={{ position: 'absolute', bottom: '20%', left: '10%', width: '300px', height: '300px', backgroundColor: '#84CC16', opacity: 0.06, filter: 'blur(80px)', borderRadius: '50%' }} 
      />
      <div 
        className="animate-float-2-reverse" 
        style={{ position: 'absolute', top: '60%', right: '20%', width: '350px', height: '350px', backgroundColor: '#3B82F6', opacity: 0.07, filter: 'blur(85px)', borderRadius: '50%' }} 
      />

      {/* Layer 2 - Canvas Particles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Layer 3 - Iridescent Streak Overlay */}
      <div className="streak-overlay" />
    </div>
  );
}
