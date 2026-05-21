import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf7] p-6 text-center text-[#2f1c24] font-body">
          <div className="max-w-md">
            <h1 className="font-serif text-4xl font-semibold mb-4 text-[#d41478]">Oops! Something went wrong.</h1>
            <p className="mb-6 text-[#6a5960]">
              We hit a snag loading this page. Please try refreshing or come back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-8 py-3 rounded-full bg-[#d41478] text-white text-sm font-semibold uppercase hover:bg-[#a80e5d] transition-colors duration-300"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
