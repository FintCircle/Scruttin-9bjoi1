import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Calendar, Briefcase, ChevronLeft, Plus } from 'lucide-react';
import { MOCK_PROJECTS, STAGE_COLORS, CURRENT_USER_ID } from '@/constants/mockData';
import TagAlongButton from '@/components/features/TagAlongButton';
import UpdateCard from '@/components/features/UpdateCard';
import TimelineEditor from '@/components/features/TimelineEditor';
import PostUpdateModal from '@/components/features/PostUpdateModal';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useProjectUpdates } from '@/hooks/useProjectUpdates';
import { MOCK_USERS } from '@/constants/mockData';
import CountryMap from '@/components/features/CountryMap';

const LOOKING_FOR_ICONS: Record<string, string> = {
  'Beta testers': '🧪',
  'Designer': '🎨',
  'Cofounder': '🤝',
  'Developer': '👨‍💻',
  'Investors': '💰',
  'Marketing help': '📣',
  'Suppliers': '🏪',
  'Feedback': '💬',
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<'updates' | 'timeline' | 'about'>('updates');
  const [helped, setHelped] = useState<string[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [updateKey, setUpdateKey] = useState(0); // force re-render after posting

  const { getAllUpdatesForProject } = useProjectUpdates();
  const project = MOCK_PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="font-bold text-xl text-[hsl(222,47%,9%)]">Project not found</p>
        <Link to="/discover" className="text-[hsl(24,95%,53%)] text-sm mt-2 inline-block hover:underline">
          ← Back to Discover
        </Link>
      </div>
    );
  }

  const currentUser = MOCK_USERS.find(u => u.id === CURRENT_USER_ID);
  const isOwner = project.founderId === CURRENT_USER_ID;
  const allUpdates = getAllUpdatesForProject(project.id);

  return (
    <div className="page-enter">
      {/* Back */}
      <Link to="/discover" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[hsl(222,47%,9%)] text-sm font-medium mb-4 transition-colors">
        <ChevronLeft size={16} />
        Discover
      </Link>

      {/* Hero Banner */}
      <div className="h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 relative mb-0">
        <img src={project.logo} alt={project.name} className="w-full h-full object-cover opacity-30" />
      </div>

      {/* Project Identity */}
      <div className="bg-white rounded-2xl border border-slate-100 -mt-4 mx-0 px-4 pt-0 pb-4 mb-4 relative">
        <div className="flex items-end justify-between gap-3 -mt-8 mb-3">
          <img
            src={project.logo}
            alt={project.name}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md flex-shrink-0"
          />
          <div className="pb-1">
            <TagAlongButton projectId={project.id} tagAlongCount={project.tagAlongCount} size="md" />
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h1 className="text-2xl font-black text-[hsl(222,47%,9%)]">{project.name}</h1>
            <p className="text-slate-600 text-sm mt-0.5">{project.tagline}</p>
          </div>
          <span className={`flex-shrink-0 mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${STAGE_COLORS[project.stage]}`}>
            {project.stage}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1"><MapPin size={12} />{project.location}</span>
          <span className="flex items-center gap-1"><Briefcase size={12} />{project.industry}</span>
          <span className="flex items-center gap-1"><Calendar size={12} />Since {project.startedDate}</span>
          {project.website && (
            <span className="flex items-center gap-1 text-[hsl(24,95%,53%)]">
              <Globe size={12} />{project.website}
            </span>
          )}
        </div>

        {/* Founder */}
        <Link
          to={`/profile/${project.founderId.replace('user-', '')}`}
          className="flex items-center gap-2 group"
        >
          <img src={project.founderAvatar} alt={project.founderName} className="w-6 h-6 rounded-full object-cover" />
          <span className="text-xs text-slate-500 group-hover:text-[hsl(24,95%,53%)] transition-colors">
            Built by <span className="font-semibold">{project.founderName}</span>
          </span>
        </Link>
      </div>

      {/* Looking For */}
      {project.lookingFor.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Looking For</h3>
          <div className="flex flex-wrap gap-2">
            {project.lookingFor.map(item => (
              <button
                key={item}
                onClick={() => setHelped(prev => prev.includes(item) ? prev.filter(h => h !== item) : [...prev, item])}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  helped.includes(item)
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600'
                )}
              >
                <span>{LOOKING_FOR_ICONS[item] || '✨'}</span>
                {helped.includes(item) ? `Offering ${item}` : `I Can Help — ${item}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
        {(['updates', 'timeline', 'about'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all',
              tab === t
                ? 'bg-white text-[hsl(222,47%,9%)] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {t === 'updates' ? `Updates (${allUpdates.length})` : t === 'timeline' ? 'Timeline' : 'About'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'updates' && (
        <div className="flex flex-col gap-3">
          {/* Post update button (owner only) */}
          {isOwner && (
            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2.5 w-full p-3.5 bg-white border-2 border-dashed border-orange-200 rounded-2xl text-left hover:border-orange-300 hover:bg-orange-50 transition-all group"
            >
              <img
                src={currentUser?.avatar ?? project.founderAvatar}
                alt="You"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-sm text-slate-400 group-hover:text-orange-500 transition-colors">
                Share an update, milestone, decision…
              </span>
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(24,95%,53%)] text-white text-xs font-bold rounded-lg flex-shrink-0">
                <Plus size={12} />
                Post
              </div>
            </button>
          )}

          {allUpdates.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">No updates yet.</p>
              {isOwner && (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="text-[hsl(24,95%,53%)] text-xs font-medium mt-2 hover:underline"
                >
                  Post your first update →
                </button>
              )}
            </div>
          ) : (
            allUpdates.map(update => (
              <UpdateCard key={`${update.id}-${updateKey}`} update={update} showProject={false} />
            ))
          )}
        </div>
      )}

      {tab === 'timeline' && (
        <TimelineEditor projectId={project.id} isOwner={isOwner} />
      )}

      {tab === 'about' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-4">
          <p className="text-slate-700 text-sm leading-relaxed">{project.description}</p>
          <CountryMap countryName={project.location.split(',').pop()?.trim() ?? project.location} />
        </div>
      )}

      {/* Post Update Modal */}
      {showPostModal && currentUser && (
        <PostUpdateModal
          projectId={project.id}
          projectName={project.name}
          projectLogo={project.logo}
          authorName={currentUser.name}
          authorAvatar={currentUser.avatar}
          onClose={() => setShowPostModal(false)}
          onPosted={() => setUpdateKey(k => k + 1)}
        />
      )}
    </div>
  );
}
