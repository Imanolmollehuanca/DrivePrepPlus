import { useEffect, useRef } from 'react';

/**
 * ConfettiCanvas — Animación nativa de celebración sin dependencias externas
 */
export default function ConfettiCanvas({ duracionMs = 3500 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const colores = ['#38bdf8', '#0284c7', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#8b5cf6', '#ec4899'];
    const CANTIDAD = Math.min(120, Math.floor(width / 10));

    const particulas = Array.from({ length: CANTIDAD }, () => ({
      x: width * Math.random(),
      y: -20 - Math.random() * height * 0.4,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 5,
      color: colores[Math.floor(Math.random() * colores.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2.5 + Math.random() * 4,
      angulo: Math.random() * 360,
      vAngulo: (Math.random() - 0.5) * 10,
      opacidad: 1,
    }));

    const inicio = performance.now();

    const loop = (tiempo) => {
      const transcurrido = tiempo - inicio;
      ctx.clearRect(0, 0, width, height);

      let vivas = 0;
      particulas.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravedad
        p.angulo += p.vAngulo;

        if (transcurrido > duracionMs - 1000) {
          p.opacidad = Math.max(0, (duracionMs - transcurrido) / 1000);
        }

        if (p.opacidad > 0 && p.y < height + 50) {
          vivas++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angulo * Math.PI) / 180);
          ctx.globalAlpha = p.opacidad;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (transcurrido < duracionMs && vivas > 0) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [duracionMs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
