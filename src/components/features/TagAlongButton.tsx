import { useState } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTagAlong } from '@/hooks/useTagAlong';

interface TagAlongButtonProps {
  projectId: string;
  tagAlongCount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TagAlongButton({ projectId, tagAlongCount, size = 'md', className }: TagAlongButtonProps) {
  const { isTagged, toggleTag } = useTagAlong();
  const [pulsing, setPulsing] = useState(false);
  const tagged = isTagged(projectId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleTag(projectId);
    if (!tagged) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 600);
    }
  };

  const count = tagged ? tagAlongCount + 1 : tagAlongCount;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center font-semibold rounded-lg transition-all duration-200',
        sizeClasses[size],
        tagged
          ? 'bg-[hsl(24,95%,53%)] text-white shadow-md hover:bg-orange-600'
          : 'bg-white border-2 border-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)] hover:bg-orange-50',
        pulsing && 'tag-along-pulse',
        className
      )}
    >
      <Users size={size === 'sm' ? 13 : 15} />
      <span>{tagged ? 'Tagging Along' : 'Tag Along'}</span>
      <span className={cn(
        'font-normal',
        tagged ? 'text-orange-100' : 'text-slate-400',
        size === 'sm' ? 'text-xs' : 'text-xs'
      )}>
        {count.toLocaleString()}
      </span>
    </button>
  );
}
