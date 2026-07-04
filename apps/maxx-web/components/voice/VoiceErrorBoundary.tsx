"use client";

import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * VoiceErrorBoundary - Error boundary for voice feature
 *
 * Catches errors in Voice APIs and gracefully hides the feature
 * instead of breaking the entire page.
 */
export class VoiceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // Log error silently, don't break UI
  }

  render() {
    if (this.state.hasError) {
      // Return nothing - silently fail instead of rendering broken button
      return null;
    }

    return this.props.children;
  }
}
