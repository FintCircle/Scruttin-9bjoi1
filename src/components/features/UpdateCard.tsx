import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import type { ProjectUpdate } from '@/types';
import { UPDATE_TYPE_STYLES } from '@/constants/mockData';
import { cn } from '@/lib/utils';

interface UpdateCardProps {
  update: ProjectUpdate;
  showProject?: boolean;
}

export default function UpdateCard({ update, showProject = true }: UpdateCardProps) {
  const [liked, setLiked] = useState(false);
  const style = UPDATE_TYPE_STYLES[update.type] || UPDATE_TYPE_STYLES['Update'];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
      {showProject && (
        <Link to={`/project/${update.projectId}`} className="flex items-center gap-2 mb-3 group">
          <img
            src={update.projectLogo}
            alt={update.projectName}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-sm font-semibold text-[hsl(222,47%,9%)] group-hover:text-[hsl(24,95%,53%)] transition-colors">
            {update.projectName}
          </span>
        </Link>
      )}

      <div className="flex items-start gap-3">
        <img
          src={update.authorAvatar}
          alt={update.authorName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1', style.bg, style.color)}>
              <span>{style.emoji}</span>
              <span>{update.type}</span>
            </span>
            <span className="text-slate-400 text-xs">{update.timestamp}</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{update.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium transition-colors',
                liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
              )}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              <span>{liked ? update.likes + 1 : update.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
              <MessageCircle size={14} />
              <span>{update.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
