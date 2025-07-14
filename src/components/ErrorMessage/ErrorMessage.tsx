interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="card flex flex-col items-center justify-center py-16 px-8 text-center my-8">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-red-600 text-xl font-semibold mb-4">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-base mb-8 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
