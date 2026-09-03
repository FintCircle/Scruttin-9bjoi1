import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, FolderPlus, HelpCircle, PenLine, Mic } from 'lucide-react';
import type { ProjectStage, Industry } from '@/types';
import { cn } from '@/lib/utils';

const stages: ProjectStage[] = ['Idea', 'Validating', 'Building', 'Testing', 'Launched', 'Growing'];
const industries: Industry[] = [
  'Technology', 'SaaS', 'Food & Beverage', 'Fashion', 'Retail',
  'Finance', 'Education', 'Health', 'Media', 'E-commerce', 'Services', 'Other'
];

const lookingForOptions = [
  'Beta testers', 'Designer', 'Cofounder', 'Developer',
  'Investors', 'Marketing help', 'Suppliers', 'Feedback'
];

const createOptions = [
  {
    id: 'project',
    icon: FolderPlus,
    title: 'Start a Project',
    description: 'Create a page for what you\'re building. Share progress, get people tagging along.',
    color: 'border-orange-200 bg-orange-50',
    iconColor: 'bg-[hsl(24,95%,53%)] text-white',
  },
  {
    id: 'question',
    icon: HelpCircle,
    title: 'Ask a Business Question',
    description: 'Post a question to the community. Get voice or text answers from experienced founders.',
    color: 'border-blue-200 bg-blue-50',
    iconColor: 'bg-blue-500 text-white',
  },
  {
    id: 'article',
    icon: PenLine,
    title: 'Write an Article',
    description: 'Share a story, lesson, or deep-dive from your business journey.',
    color: 'border-purple-200 bg-purple-50',
    iconColor: 'bg-purple-500 text-white',
  },
];

export default function Create() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    stage: 'Idea' as ProjectStage,
    industry: 'Technology' as Industry,
    location: '',
    lookingFor: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleLookingFor = (item: string) => {
    setForm(f => ({
      ...f,
      lookingFor: f.lookingFor.includes(item)
        ? f.lookingFor.filter(i => i !== item)
        : [...f.lookingFor, item],
    }));
  };

  const handleCreateProject = () => {
    if (!form.name.trim() || !form.tagline.trim()) return;
    console.log('Creating project:', form);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/discover');
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-enter">
        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 text-4xl">🚀</div>
        <h2 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-2">Project created!</h2>
        <p className="text-slate-500 text-sm max-w-xs">
          Your project is live. Start sharing updates and let people tag along with your journey.
        </p>
        <p className="text-slate-400 text-xs mt-4">Redirecting to Discover...</p>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-1">Create</h1>
          <p className="text-slate-500 text-sm">What do you want to share with Scruttin?</p>
        </div>

        <div className="flex flex-col gap-4">
          {createOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={cn(
                'flex items-start gap-4 p-4 rounded-2xl border-2 text-left hover:shadow-md transition-all group',
                opt.color
              )}
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', opt.iconColor)}>
                <opt.icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[hsl(222,47%,9%)] text-base mb-1">{opt.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{opt.description}</p>
              </div>
              <ChevronRight size={18} className="text-slate-400 mt-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selected === 'project') {
    return (
      <div className="page-enter">
        <button
          onClick={() => { setSelected(null); setStep(1); }}
          className="text-sm text-slate-500 hover:text-[hsl(222,47%,9%)] font-medium mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        <div className="mb-6">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Step {step} of 2</p>
          <h1 className="text-2xl font-black text-[hsl(222,47%,9%)]">
            {step === 1 ? "What are you building?" : "Details & Needs"}
          </h1>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Project name *</label>
              <input
                type="text"
                placeholder="e.g. Bakawa Coffee"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Describe it in one sentence *</label>
              <input
                type="text"
                placeholder="e.g. Specialty coffee roasted in Accra, sourced directly from African farms."
                value={form.tagline}
                onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">What stage are you at?</label>
              <div className="grid grid-cols-3 gap-2">
                {stages.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setForm(f => ({ ...f, stage }))}
                    className={cn(
                      'py-2 rounded-lg text-sm font-semibold transition-all border',
                      form.stage === stage
                        ? 'bg-[hsl(222,47%,9%)] text-white border-[hsl(222,47%,9%)]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.name.trim() || !form.tagline.trim()}
              className="w-full py-3 bg-[hsl(24,95%,53%)] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Industry</label>
              <div className="flex flex-wrap gap-2">
                {industries.map(ind => (
                  <button
                    key={ind}
                    onClick={() => setForm(f => ({ ...f, industry: ind }))}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                      form.industry === ind
                        ? 'bg-[hsl(222,47%,9%)] text-white border-[hsl(222,47%,9%)]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Where are you building it?</label>
              <input
                type="text"
                placeholder="e.g. Nairobi, Kenya"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">What are you looking for?</label>
              <div className="flex flex-wrap gap-2">
                {lookingForOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleLookingFor(opt)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                      form.lookingFor.includes(opt)
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-orange-200'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 py-3 bg-[hsl(24,95%,53%)] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Start Project 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (selected === 'question') {
    return (
      <div className="page-enter">
        <button onClick={() => setSelected(null)} className="text-sm text-slate-500 hover:text-[hsl(222,47%,9%)] font-medium mb-6 flex items-center gap-1 transition-colors">
          ← Back
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[hsl(222,47%,9%)]">Ask the community</h1>
          <p className="text-slate-500 text-sm mt-1">Experienced founders will answer with voice or text.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 flex gap-3">
          <Mic size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">Voice answers are a big part of Scruttin. Someone with 10 years of experience might record a 2-minute answer instead of writing 500 words.</p>
        </div>
        <textarea
          placeholder="What do you want to know? Be specific — 'How did you get your first enterprise customer?' gets better answers than 'How do I grow?'"
          className="w-full h-40 p-4 bg-white border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          autoFocus
        />
        <button
          onClick={() => navigate('/qa')}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Post Question
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <button onClick={() => setSelected(null)} className="text-sm text-slate-500 hover:text-[hsl(222,47%,9%)] font-medium mb-6 flex items-center gap-1 transition-colors">
        ← Back
      </button>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[hsl(222,47%,9%)]">Write an article</h1>
        <p className="text-slate-500 text-sm mt-1">Share a story, lesson, or deep-dive from your journey.</p>
      </div>
      <input
        placeholder="Title"
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
      />
      <textarea
        placeholder="Write something worth reading..."
        className="w-full h-64 p-4 bg-white border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
        autoFocus
      />
      <button className="w-full py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors">
        Publish Article
      </button>
    </div>
  );
}
