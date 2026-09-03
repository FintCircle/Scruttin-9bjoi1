import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, MapPin, User, Briefcase, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';

const EXPERTISE_OPTIONS = [
  'Product development', 'Bootstrapping', 'SaaS', 'Marketing', 'Sales',
  'Fundraising', 'Operations', 'Hiring', 'Finance', 'Design',
  'Engineering', 'E-commerce', 'Food business', 'Retail', 'Fashion',
  'Health', 'Education', 'Media', 'Legal', 'Customer Success',
];

const INDUSTRY_OPTIONS = [
  { label: 'Technology', emoji: '💻' },
  { label: 'SaaS', emoji: '☁️' },
  { label: 'Food & Beverage', emoji: '☕' },
  { label: 'Fashion', emoji: '👗' },
  { label: 'Retail', emoji: '🛍️' },
  { label: 'Finance', emoji: '💰' },
  { label: 'Education', emoji: '📚' },
  { label: 'Health', emoji: '💊' },
  { label: 'Media', emoji: '📱' },
  { label: 'E-commerce', emoji: '🛒' },
  { label: 'Services', emoji: '🤝' },
  { label: 'Manufacturing', emoji: '🏭' },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  const toggleExpertise = (item: string) => {
    setExpertise(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const toggleIndustry = (item: string) => {
    setIndustries(prev => {
      if (prev.includes(item)) return prev.filter(i => i !== item);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, item];
    });
  };

  const handleFinish = () => {
    completeOnboarding({ name, location, expertise, industries });
    onComplete();
  };

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return location.trim().length > 0;
    if (step === 3) return expertise.length > 0;
    if (step === 4) return industries.length === 3;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(222,47%,9%)]/95 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="bg-[hsl(222,47%,9%)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[hsl(24,95%,53%)] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="text-white font-black text-base tracking-tight">Scruttin</span>
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i + 1 < step
                    ? 'w-5 h-2 bg-[hsl(24,95%,53%)]'
                    : i + 1 === step
                    ? 'w-5 h-2 bg-white'
                    : 'w-2 h-2 bg-white/20'
                )}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-7">
          {step === 1 && (
            <div className="page-enter">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-5">
                <User size={22} className="text-[hsl(24,95%,53%)]" />
              </div>
              <h2 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-1">Welcome to Scruttin</h2>
              <p className="text-slate-500 text-sm mb-6">
                The place to build in public, learn from others, and tag along with businesses you believe in.
              </p>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Amara Diallo"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canNext() && setStep(2)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] focus:border-transparent"
              />
            </div>
          )}

          {step === 2 && (
            <div className="page-enter">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                <MapPin size={22} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-1">Where are you building?</h2>
              <p className="text-slate-500 text-sm mb-6">
                We'll show you projects being built near you and connect you with local founders.
              </p>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your location</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Lagos, Nigeria"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canNext() && setStep(3)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] focus:border-transparent"
              />
            </div>
          )}

          {step === 3 && (
            <div className="page-enter">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-5">
                <Briefcase size={22} className="text-purple-500" />
              </div>
              <h2 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-1">What do you know?</h2>
              <p className="text-slate-500 text-sm mb-5">
                Pick the areas where you have experience or want to contribute. Others will discover you through these.
              </p>
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
                {EXPERTISE_OPTIONS.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleExpertise(item)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                      expertise.includes(item)
                        ? 'bg-[hsl(24,95%,53%)] text-white border-[hsl(24,95%,53%)]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700'
                    )}
                  >
                    {expertise.includes(item) && <Check size={10} className="inline mr-1" />}
                    {item}
                  </button>
                ))}
              </div>
              {expertise.length > 0 && (
                <p className="text-xs text-slate-400 mt-3">{expertise.length} selected</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="page-enter">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
                <Compass size={22} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-1">Pick 3 industries</h2>
              <p className="text-slate-500 text-sm mb-5">
                We'll personalise your Discover feed and Tagged suggestions around these.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRY_OPTIONS.map(({ label, emoji }) => {
                  const selected = industries.includes(label);
                  const maxed = !selected && industries.length >= 3;
                  return (
                    <button
                      key={label}
                      onClick={() => toggleIndustry(label)}
                      disabled={maxed}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                        selected
                          ? 'bg-[hsl(222,47%,9%)] text-white border-[hsl(222,47%,9%)]'
                          : maxed
                          ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      )}
                    >
                      <span className="text-base">{emoji}</span>
                      <span className="text-xs">{label}</span>
                      {selected && <Check size={12} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {industries.length}/3 selected
              </p>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[hsl(24,95%,53%)] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canNext()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[hsl(24,95%,53%)] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              Start exploring 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
