import React, { Component, ReactNode, ErrorInfo } from 'react';
import { useSolutions } from './context';

interface ErrorBoundaryProps {
  slotName: string;
  onError?: (error: Error) => void;
  renderSlot: () => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SlotErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[SolutionSlot] Runtime error in slot "${this.props.slotName}":`, error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-testid={`solution-slot-error-${this.props.slotName}`}
          className="p-4 border border-red-500 bg-red-950/20 text-red-500 text-sm my-4 rounded-none"
          role="alert"
        >
          <strong className="block font-semibold mb-1">Solution Runtime Error</strong>
          <p>
            The active solution for slot <code>{this.props.slotName}</code> failed during rendering: {this.state.error?.message}
          </p>
        </div>
      );
    }

    try {
      return this.props.renderSlot();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return (
        <div
          data-testid={`solution-slot-error-${this.props.slotName}`}
          className="p-4 border border-red-500 bg-red-950/20 text-red-500 text-sm my-4 rounded-none"
          role="alert"
        >
          <strong className="block font-semibold mb-1">Solution Runtime Error</strong>
          <p>
            The active solution for slot <code>{this.props.slotName}</code> failed during rendering: {error.message}
          </p>
        </div>
      );
    }
  }
}

export interface SolutionSlotProps {
  name: string;
  fallback: ReactNode;
  props?: Record<string, unknown>;
  onError?: (error: Error) => void;
}

export const SolutionSlot: React.FC<SolutionSlotProps> = ({
  name,
  fallback,
  props,
  onError,
}) => {
  const { getSlotRenderer, isSlotFailed } = useSolutions();

  // 1. Check if the solution providing this slot explicitly failed during init
  const failure = isSlotFailed(name);
  if (failure.failed) {
    return (
      <div
        data-testid={`solution-slot-failed-${name}`}
        className="p-4 border border-red-500 bg-red-950/20 text-red-500 text-sm my-4 rounded-none"
        role="alert"
      >
        <strong className="block font-semibold mb-1">Solution Initialization Error</strong>
        <p>
          Solution <code>{failure.solutionId}</code> registered for slot <code>{name}</code> failed to initialize: {failure.error}
        </p>
      </div>
    );
  }

  // 2. Check if an active solution provides this slot
  const renderer = getSlotRenderer(name);
  if (renderer) {
    return (
      <SlotErrorBoundary slotName={name} renderSlot={() => renderer(props)} onError={onError} />
    );
  }

  // 3. Unprovided or disabled: render Core fallback exactly once
  return <>{fallback}</>;
};

export default SolutionSlot;
