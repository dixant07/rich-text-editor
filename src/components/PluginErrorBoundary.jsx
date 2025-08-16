import React from 'react';

class PluginErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Plugin Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return null to render nothing instead of crashing
      console.warn(`Plugin "${this.props.pluginName}" failed to load:`, this.state.error);
      return null;
    }

    return this.props.children;
  }
}

export default PluginErrorBoundary;