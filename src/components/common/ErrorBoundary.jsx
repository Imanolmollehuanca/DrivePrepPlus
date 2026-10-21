import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

/**
 * ErrorBoundary — Atrapa errores de renderizado para evitar pantallas blancas
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tieneError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { tieneError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un fallo:', error, errorInfo);
  }

  handleReintentar = () => {
    this.setState({ tieneError: false, error: null });
  };

  render() {
    if (this.state.tieneError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-[fadeIn_0.3s_ease]">
          <div className="card max-w-md w-full p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-extrabold font-display" style={{ color: 'var(--color-text-primary)' }}>
                Algo no salió como esperábamos
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                Ocurrió un problema temporal al cargar esta vista. Tus datos y progreso están a salvo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={this.handleReintentar}
                className="btn-primary flex-1 justify-center py-2.5 text-xs font-bold rounded-xl"
              >
                <RotateCcw size={14} />
                <span>Reintentar vista</span>
              </button>
              <a
                href="/dashboard"
                className="btn-secondary flex-1 justify-center py-2.5 text-xs font-semibold rounded-xl"
              >
                <Home size={14} />
                <span>Ir al inicio</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
