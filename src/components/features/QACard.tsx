import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowUp, Mic, AlignLeft } from 'lucide-react';
import type { QAQuestion } from '@/types';
import VoiceAnswer from './VoiceAnswer';
import { cn } from '@/lib/utils';

interface QACardProps {
  question: QAQuestion;
}

export default function QACard({ question }: QACardProps) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Vote */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
            <button
              onClick={() => setVoted(!voted)}
              className={cn(
                'flex flex-col items-center gap-0.5 transition-colors',
                voted ? 'text-[hsl(24,95%,53%)]' : 'text-slate-300 hover:text-[hsl(24,95%,53%)]'
              )}
            >
              <ArrowUp size={16} />
              <span className="text-xs font-bold">{voted ? question.votes + 1 : question.votes}</span>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-left w-full"
            >
              <p className="font-semibold text-[hsl(222,47%,9%)] text-sm leading-relaxed hover:text-[hsl(24,95%,53%)] transition-colors">
                {question.question}
              </p>
            </button>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                {question.category}
              </span>
              <span className="text-slate-400 text-xs">{question.askedBy}</span>
              <span className="text-slate-300 text-xs">·</span>
              <span className="text-slate-400 text-xs">{question.timestamp}</span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[hsl(24,95%,53%)] transition-colors"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {question.answers.length} answer{question.answers.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      {expanded && (
        <div className="border-t border-slate-50 divide-y divide-slate-50">
          {question.answers.map(answer => (
            <div key={answer.id} className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={answer.authorAvatar}
                  alt={answer.authorName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      to={`/profile/${answer.authorId.replace('user-', '')}`}
                      className="text-sm font-semibold text-[hsl(222,47%,9%)] hover:text-[hsl(24,95%,53%)] transition-colors"
                    >
                      {answer.authorName}
                    </Link>
                    {answer.authorProject && (
                      <span className="text-xs text-slate-400">· {answer.authorProject}</span>
                    )}
                    <span className={cn(
                      'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium',
                      answer.type === 'voice'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-blue-50 text-blue-600'
                    )}>
                      {answer.type === 'voice' ? <Mic size={10} /> : <AlignLeft size={10} />}
                      {answer.type}
                    </span>
                    <span className="text-slate-400 text-xs">{answer.timestamp}</span>
                  </div>

                  {answer.type === 'voice' && answer.duration ? (
                    <VoiceAnswer duration={answer.duration} authorName={answer.authorName} />
                  ) : (
                    <p className="text-slate-700 text-sm leading-relaxed">{answer.content}</p>
                  )}

                  <button className="flex items-center gap-1 mt-2 text-slate-400 hover:text-[hsl(24,95%,53%)] transition-colors text-xs">
                    <ArrowUp size={12} />
                    <span>{answer.votes} helpful</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
