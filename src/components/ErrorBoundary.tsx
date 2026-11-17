import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      let friendly = this.state.message;
      try {
        const parsed = JSON.parse(this.state.message) as { error?: string; operationType?: string };
        if (parsed?.error) {
          friendly = `${parsed.operationType ? `${parsed.operationType}: ` : ''}${parsed.error}`;
        }
      } catch {
        // non-JSON error message
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-4">
            <h1 className="text-xl font-extrabold text-[var(--red)]">Something went wrong</h1>
            <p className="text-sm text-[var(--soft)]">
              A database or application error occurred. You can reload the page and sign in again.
            </p>
            <pre className="p-3 rounded-[10px] border border-[var(--line)] bg-[var(--panel)] text-xs overflow-x-auto whitespace-pre-wrap break-words">
              {friendly}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bq-btn px-4 py-2 text-sm"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
