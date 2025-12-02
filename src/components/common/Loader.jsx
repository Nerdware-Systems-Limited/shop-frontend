import { Skeleton } from '../ui/skeleton';

const Loader = ({ variant = 'spinner' }) => {
  if (variant === 'skeleton') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;