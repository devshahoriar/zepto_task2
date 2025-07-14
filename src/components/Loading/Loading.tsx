interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Loading books...' }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
  
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loading;
