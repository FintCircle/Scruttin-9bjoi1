import { useParams, Link } from 'react-router-dom';
import { MapPin, BookMarked, HelpCircle, FileText, Mic, AlignLeft, X, Send } from 'lucide-react';
import { useState } from 'react';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_PROFILE_QUESTIONS, CURRENT_USER_ID } from '@/constants/mockData';
import TagAlongButton from '@/components/features/TagAlongButton';
import VoiceAnswer from '@/components/features/VoiceAnswer';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState<'projects' | 'questions' | 'articles'>('projects');
  const [showAskModal, setShowAskModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const user = MOCK_USERS.find(u => u.username === username);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="font-bold text-xl text-[hsl(222,47%,9%)]">User not found</p>
        <Link to="/discover" className="text-[hsl(24,95%,53%)] text-sm mt-2 inline-block hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  const userProjects = MOCK_PROJECTS.filter(p => user.projectIds.includes(p.id));
  const userQuestions = MOCK_PROFILE_QUESTIONS.filter(q => q.toUserId === user.id && q.isAnswered && q.isPublic);
  const isOwnProfile = user.id === CURRENT_USER_ID;

  const pendingQuestions = isOwnProfile
    ? MOCK_PROFILE_QUESTIONS.filter(q => q.toUserId === user.id && !q.isAnswered)
    : [];

  const handleSubmitQuestion = () => {
    if (!questionText.trim()) return;
    console.log('Profile question submitted:', questionText, 'to:', user.name);
    setSubmitted(true);
    setTimeout(() => {
      setShowAskModal(false);
      setQuestionText('');
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="page-enter">
      {/* Cover */}
      <div className="h-24 rounded-2xl bg-gradient-to-br from-[hsl(222,47%,9%)] to-slate-700 mb-0" />

      {/* Profile Identity */}
      <div className="bg-white rounded-2xl border border-slate-100 -mt-4 px-4 pt-0 pb-4 mb-4">
        <div className="flex items-end justify-between gap-3 -mt-8 mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md flex-shrink-0"
          />
          {isOwnProfile ? (
            <button className="px-4 py-1.5 border-2 border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:border-slate-300 transition-colors">
              Edit Profile
            </button>
          ) : user.acceptingQuestions && (
            <button
              onClick={() => setShowAskModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[hsl(24,95%,53%)] text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Send size={12} />
              Ask {user.name.split(' ')[0]}
            </button>
          )}
        </div>

        <div className="mb-3">
          <h1 className="text-xl font-black text-[hsl(222,47%,9%)]">{user.name}</h1>
          <p className="text-slate-400 text-xs font-medium">@{user.username}</p>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-3">{user.bio}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin size={12} />{user.location}</span>
        </div>

        {/* Expertise tags */}
        {user.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.expertise.map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-lg font-black text-[hsl(222,47%,9%)]">{userProjects.length}</p>
            <p className="text-[11px] text-slate-400 font-medium">Building</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-lg font-black text-[hsl(222,47%,9%)]">{user.answeredQuestions}</p>
            <p className="text-[11px] text-slate-400 font-medium">Answered</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-[hsl(222,47%,9%)]">{user.taggedCount}</p>
            <p className="text-[11px] text-slate-400 font-medium">Tagged Along</p>
          </div>
        </div>
      </div>

      {/* Ask topics (if accepting questions) */}
      {user.acceptingQuestions && user.askTopics.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-orange-800 mb-2">
                Ask {user.name.split(' ')[0]} about
              </p>
              <div className="flex flex-wrap gap-1.5">
                {user.askTopics.map(topic => (
                  <span key={topic} className="px-2.5 py-1 bg-white border border-orange-200 text-orange-700 text-xs rounded-full font-medium">
                    ✓ {topic}
                  </span>
                ))}
              </div>
            </div>
            {!isOwnProfile && (
              <button
                onClick={() => setShowAskModal(true)}
                className="flex-shrink-0 px-3 py-1.5 bg-[hsl(24,95%,53%)] text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Submit question
              </button>
            )}
          </div>
        </div>
      )}

      {/* Own profile: pending questions */}
      {isOwnProfile && pendingQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-4 mb-4">
          <p className="text-xs font-bold text-amber-700 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-black text-xs">
              {pendingQuestions.length}
            </span>
            Question{pendingQuestions.length > 1 ? 's' : ''} waiting for your answer
          </p>
          <div className="flex flex-col gap-2">
            {pendingQuestions.map(q => (
              <div key={q.id} className="flex items-start justify-between gap-3 p-3 bg-amber-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-600 font-medium mb-0.5">{q.fromName}</p>
                  <p className="text-sm font-medium text-[hsl(222,47%,9%)]">{q.question}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="px-2.5 py-1 bg-[hsl(24,95%,53%)] text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                    Answer
                  </button>
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setTab('projects')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1',
            tab === 'projects' ? 'bg-white text-[hsl(222,47%,9%)] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <BookMarked size={12} />
          Projects
        </button>
        <button
          onClick={() => setTab('questions')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1',
            tab === 'questions' ? 'bg-white text-[hsl(222,47%,9%)] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <HelpCircle size={12} />
          Q&A
        </button>
        <button
          onClick={() => setTab('articles')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1',
            tab === 'articles' ? 'bg-white text-[hsl(222,47%,9%)] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <FileText size={12} />
          Articles
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'projects' && (
        <div className="flex flex-col gap-3">
          {userProjects.length > 0 ? userProjects.map(project => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all"
            >
              <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[hsl(222,47%,9%)] text-sm">{project.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{project.tagline}</p>
              </div>
              <TagAlongButton projectId={project.id} tagAlongCount={project.tagAlongCount} size="sm" />
            </Link>
          )) : (
            <p className="text-center text-slate-400 py-8 text-sm">No projects yet.</p>
          )}
        </div>
      )}

      {tab === 'questions' && (
        <div className="flex flex-col gap-3">
          {userQuestions.length > 0 ? userQuestions.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="font-semibold text-[hsl(222,47%,9%)] text-sm mb-3">"{q.question}"</p>
              {q.answer && (
                <div className="pl-3 border-l-2 border-orange-200">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={cn(
                      'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium',
                      q.answer.type === 'voice' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    )}>
                      {q.answer.type === 'voice' ? <Mic size={10} /> : <AlignLeft size={10} />}
                      {q.answer.type}
                    </span>
                    <span className="text-xs text-slate-400">{q.timestamp}</span>
                  </div>
                  {q.answer.type === 'voice' && q.answer.duration ? (
                    <VoiceAnswer duration={q.answer.duration} authorName={user.name} />
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed">{q.answer.content}</p>
                  )}
                </div>
              )}
            </div>
          )) : (
            <p className="text-center text-slate-400 py-8 text-sm">No answered questions yet.</p>
          )}
        </div>
      )}

      {tab === 'articles' && (
        <div className="text-center py-12">
          <FileText size={36} className="mx-auto mb-3 text-slate-200" />
          <p className="text-slate-400 text-sm font-medium">No articles published yet.</p>
          {isOwnProfile && (
            <Link to="/create" className="text-[hsl(24,95%,53%)] text-sm mt-2 inline-block font-medium hover:underline">
              Write your first article →
            </Link>
          )}
        </div>
      )}

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                <h3 className="font-black text-[hsl(222,47%,9%)] text-lg">Ask {user.name.split(' ')[0]}</h3>
              </div>
              <button onClick={() => setShowAskModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            {user.askTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {user.askTopics.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📬</div>
                <p className="font-bold text-[hsl(222,47%,9%)]">Question sent!</p>
                <p className="text-slate-500 text-sm mt-1">{user.name.split(' ')[0]} will see it in their inbox.</p>
              </div>
            ) : (
              <>
                <textarea
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  placeholder={`Ask ${user.name.split(' ')[0]} something specific...`}
                  className="w-full h-28 p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] mb-4"
                  autoFocus
                />
                <button
                  onClick={handleSubmitQuestion}
                  disabled={!questionText.trim()}
                  className="w-full py-2.5 bg-[hsl(24,95%,53%)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Question
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
