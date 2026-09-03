import { useState } from 'react';
import { X, Mic, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UpdateType, ProjectUpdate } from '@/types';
import { UPDATE_TYPE_STYLES } from '@/constants/mockData';
import { useProjectUpdates } from '@/hooks/useProjectUpdates';

interface PostUpdateModalProps {
  projectId: string;
  projectName: string;
  projectLogo: string;
  authorName: string;
  authorAvatar: string;
  onClose: () => void;
  onPosted: () => void;
}

const UPDATE_TYPES: UpdateType[] = ['Update', 'Problem', 'Decision', 'Ask', 'Milestone', 'Lesson', 'Launch'];

const PLACEHOLDERS: Record<UpdateType, string> = {
  Update: "What's happening with the project right now?",
  Problem: "What problem are you running into? Be honest — people learn from this.",
  Decision: "What decision did you make and why?",
  Ask: "What do you want to know from people following along?",
  Milestone: "What did you just achieve? Celebrate it.",
  Lesson: "What did you just learn — the hard way or otherwise?",
  Launch: "You're launching something. Tell people what it is.",
};

export default function PostUpdateModal({
  projectId, projectName, projectLogo,
  authorName, authorAvatar, onClose, onPosted,
}: PostUpdateModalProps) {
  const { postUpdate } = useProjectUpdates();
  const [type, setType] = useState<UpdateType>('Update');
  const [content, setContent] = useState('');
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    const update: ProjectUpdate = {
      id: `upd-${Date.now()}`,
      projectId,
      projectName,
      projectLogo,
      type,
      content,
      authorName,
      authorAvatar,
      timestamp: 'just now',
      likes: 0,
      comments: 0,
    };
    postUpdate(update);
    console.log('Posted update:', update);
    setPosted(true);
    setTimeout(() => {
      onPosted();
      onClose();
    }, 1500);
  };

  const style = UPDATE_TYPE_STYLES[type];

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img src={projectLogo} alt={projectName} className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Posting update to</p>
              <p className="text-sm font-bold text-[hsl(222,47%,9%)]">{projectName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {posted ? (
          <div className="px-5 py-12 text-center">
            <div className="text-4xl mb-3">{style.emoji}</div>
            <p className="font-bold text-[hsl(222,47%,9%)] text-lg">Update posted!</p>
            <p className="text-slate-500 text-sm mt-1">
              Everyone tagging along with {projectName} will see this.
            </p>
          </div>
        ) : (
          <>
            {/* Update type selector */}
            <div className="px-5 pt-4 pb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Update type</p>
              <div className="flex flex-wrap gap-1.5">
                {UPDATE_TYPES.map(t => {
                  const s = UPDATE_TYPE_STYLES[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                        type === t
                          ? `${s.bg} ${s.color} border-current`
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      )}
                    >
                      <span>{s.emoji}</span>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected type indicator */}
            <div className={cn('mx-5 mb-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2', style.bg, style.color)}>
              <span className="text-base">{style.emoji}</span>
              <span>You're posting a <strong>{type}</strong></span>
            </div>

            {/* Text input */}
            <div className="px-5 pb-4">
              <div className="flex items-start gap-3 mb-4">
                <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" />
                <textarea
                  autoFocus
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={PLACEHOLDERS[type]}
                  rows={4}
                  className="flex-1 p-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none leading-relaxed"
                />
              </div>

              {/* Voice hint */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-lg">
                <Mic size={14} className="text-orange-400 flex-shrink-0" />
                <p className="text-xs text-orange-600">Voice updates coming soon — record your update in your own words.</p>
              </div>

              <div className="flex items-center justify-between">
                <p className={cn('text-xs font-medium', content.length > 500 ? 'text-red-500' : 'text-slate-300')}>
                  {content.length}/500
                </p>
                <button
                  onClick={handlePost}
                  disabled={!content.trim() || content.length > 500}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(24,95%,53%)] text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <PenLine size={14} />
                  Post Update
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
