/* ============================================================
   DrivePrep+ — Audio Feedback (Web Audio API)
   Sintetizador nativo ultraligero sin archivos externos ni dependencias.
   ============================================================ */

const KEY_SONIDO = 'driveprep_sonido_habilitado';

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function estaSonidoHabilitado() {
  try {
    const val = localStorage.getItem(KEY_SONIDO);
    return val !== null ? JSON.parse(val) : true;
  } catch {
    return true;
  }
}

export function setSonidoHabilitado(habilitado) {
  try {
    localStorage.setItem(KEY_SONIDO, JSON.stringify(Boolean(habilitado)));
  } catch {
    // ignore
  }
}

/**
 * Toca un tono sintetizado con envolvente suave
 */
function tocarTono(frecuencia, duracionSeg, tipo = 'sine', gananciaMaxima = 0.08) {
  if (!estaSonidoHabilitado()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);

  // Envolvente de ataque y caída suave para evitar clicks
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(gananciaMaxima, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duracionSeg);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duracionSeg);
}

/**
 * Sonido armónico de acierto (dos notas ascendentes)
 */
export function sonidoAcierto() {
  if (!estaSonidoHabilitado()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  tocarTono(523.25, 0.12, 'sine', 0.08); // C5
  setTimeout(() => {
    tocarTono(659.25, 0.18, 'sine', 0.08); // E5
  }, 100);
}

/**
 * Sonido discreto de fallo (dos notas descendentes)
 */
export function sonidoError() {
  if (!estaSonidoHabilitado()) return;
  tocarTono(329.63, 0.12, 'sine', 0.07); // E4
  setTimeout(() => {
    tocarTono(261.63, 0.18, 'sine', 0.06); // C4
  }, 90);
}

/**
 * Click sutil de botón
 */
export function sonidoClick() {
  if (!estaSonidoHabilitado()) return;
  tocarTono(880, 0.03, 'triangle', 0.03);
}
