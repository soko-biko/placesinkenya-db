import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[400px] p-8 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-navy/10 shadow-lux my-8 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy mb-2">Something went wrong</h2>
          <p className="text-navy/60 text-sm max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 h-11 bg-navy text-white rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-safari transition-colors shadow-md"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
