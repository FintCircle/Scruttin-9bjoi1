import { useState } from 'react';
import { Search, TrendingUp, Zap, Rocket, Sprout, Sparkles } from 'lucide-react';
import { MOCK_PROJECTS, STAGE_COLORS } from '@/constants/mockData';
import type { Industry } from '@/types';
import ProjectCard from '@/components/features/ProjectCard';
import heroBg from '@/assets/hero-bg.jpg';
import { useOnboarding } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

const ALL_INDUSTRIES: Industry[] = [
  'Technology', 'Food & Beverage', 'Fashion', 'Retail',
  'Finance', 'Education', 'Health', 'SaaS', 'Media', 'E-commerce'
];

const sections = [
  { key: 'all', label: 'All Projects', icon: TrendingUp },
  { key: 'Idea', label: 'Just Starting', icon: Zap },
  { key: 'Building', label: 'Building', icon: Sprout },
  { key: 'Launched', label: 'Launched', icon: Rocket },
  { key: 'Growing', label: 'Growing', icon: TrendingUp },
];

export default function Discover() {
  const { profile } = useOnboarding();
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [showPersonalized, setShowPersonalized] = useState(
    profile.completed && profile.industries.length > 0
  );

  // Personalized suggestions based on user's chosen industries
  const personalizedProjects = profile.completed && profile.industries.length > 0
    ? MOCK_PROJECTS.filter(p => profile.industries.includes(p.industry))
    : [];

  const filtered = MOCK_PROJECTS.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStage = selectedStage === 'all' || p.stage === selectedStage;
    const matchesIndustry = selectedIndustry === 'all' || p.industry === selectedIndustry;
    return matchesSearch && matchesStage && matchesIndustry;
  });

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div
        className="relative h-52 lg:h-64 rounded-2xl overflow-hidden mb-6"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,9%)]/90 via-[hsl(222,47%,9%)]/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-1">Discover</p>
          {profile.completed && profile.name ? (
            <>
              <h1 className="text-white font-black text-2xl lg:text-3xl leading-tight mb-1">
                Welcome back, {profile.name.split(' ')[0]}.
              </h1>
              <p className="text-slate-300 text-sm">
                {MOCK_PROJECTS.length} projects being built right now.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-white font-black text-2xl lg:text-3xl leading-tight mb-1">
                Find businesses<br />worth tagging along with.
              </h1>
              <p className="text-slate-300 text-sm">
                {MOCK_PROJECTS.length} projects being built right now.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Personalized section */}
      {profile.completed && personalizedProjects.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[hsl(24,95%,53%)]" />
              <h2 className="text-sm font-bold text-[hsl(222,47%,9%)]">
                Picked for you
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              {profile.industries.map(ind => (
                <span key={ind} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded-full font-medium border border-orange-100">
                  {ind}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personalizedProjects.slice(0, 4).map(project => (
              <ProjectCard key={project.id} project={project} variant="featured" />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowPersonalized(false)}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPersonalized ? 'Show all projects ↓' : 'Show personalized ↑'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search projects, industries, locations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] focus:border-transparent"
        />
      </div>

      {/* Stage filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        {sections.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedStage(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              selectedStage === key
                ? 'bg-[hsl(222,47%,9%)] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Industry filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setSelectedIndustry('all')}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all',
            selectedIndustry === 'all'
              ? 'bg-orange-100 text-orange-700 border border-orange-200'
              : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
          )}
        >
          All Industries
        </button>
        {ALL_INDUSTRIES.map(industry => (
          <button
            key={industry}
            onClick={() => setSelectedIndustry(industry)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedIndustry === industry
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : profile.industries.includes(industry)
                ? 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
            )}
          >
            {industry}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No projects found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {featured.map(project => (
                <ProjectCard key={project.id} project={project} variant="featured" />
              ))}
            </div>
          )}
          {rest.length > 0 && (
            <div className="flex flex-col gap-3">
              {rest.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
