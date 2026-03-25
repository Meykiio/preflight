import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    errorMessage: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Preflight crashed inside the error boundary.", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.errorMessage) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-6 text-on-surface">
          <div className="max-w-lg rounded-2xl bg-surface-container-high p-8 shadow-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              Runtime Error
            </p>
            <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-primary">
              The workspace hit an unexpected error.
            </h1>
            <p className="mt-4 text-sm text-on-surface-variant">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="gradient-cta glow-primary mt-6 rounded-xl px-4 py-3 font-headline text-sm font-semibold text-on-primary"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
