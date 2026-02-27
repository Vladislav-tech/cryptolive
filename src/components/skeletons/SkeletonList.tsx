import { SkeletonCard } from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
}

export const SkeletonList = ({ count = 6 }: SkeletonListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
