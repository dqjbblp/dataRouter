import React from 'react';

interface Props {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    // 这里可以添加错误日志记录逻辑
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    setHasError(true);
  }, []);

  React.useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      handleError(event.error, { componentStack: '' });
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, [handleError]);

  if (hasError) {
    return fallback;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
