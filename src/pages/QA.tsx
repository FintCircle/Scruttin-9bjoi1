import { useState } from 'react';
import { Search, Mic, PenLine, HelpCircle, X } from 'lucide-react';
import { MOCK_QA, QA_CATEGORIES } from '@/constants/mockData';
import QACard from '@/components/features/QACard';
import { cn } from '@/lib/utils';

export default function QA() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAskModal, setShowAskModal] = useState(false);
  const [askText, setAskText] = useState('');
  const [askCategory, setAskCategory] = useState('Starting');
  const [submitted, setSubmitted] = useState(false);

  const filtered = MOCK_QA.filter(q => {
    const matchesSearch = !search || q.question.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = () => {
    if (!askText.trim()) return;
    console.log('Submitting question:', askText, 'category:', askCategory);
    setSubmitted(true);
    setTimeout(() => {
      setShowAskModal(false);
      setAskText('');
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={20} className="text-[hsl(24,95%,53%)]" />
              <h1 className="text-xl font-black text-[hsl(222,47%,9%)]">Business Q&A</h1>
            </div>
            <p className="text-slate-500 text-sm">Ask a business question. Get voice or text answers from people who've been there.</p>
          </div>
          <button
            onClick={() => setShowAskModal(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[hsl(24,95%,53%)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            <PenLine size={14} />
            Ask
          </button>
        </div>
      </div>

      {/* Answer methods callout */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
          <div className="w-9 h-9 bg-[hsl(24,95%,53%)] rounded-lg flex items-center justify-center flex-shrink-0">
            <Mic size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-800">Voice Answers</p>
            <p className="text-[11px] text-orange-600">Real experience in their own words</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <PenLine size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-800">Text Answers</p>
            <p className="text-[11px] text-blue-600">Detailed, scannable responses</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] focus:border-transparent"
        />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
            selectedCategory === 'all'
              ? 'bg-[hsl(222,47%,9%)] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          )}
        >
          All
        </button>
        {QA_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              selectedCategory === cat
                ? 'bg-[hsl(222,47%,9%)] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No questions found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(question => (
            <QACard key={question.id} question={question} />
          ))}
        </div>
      )}

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[hsl(222,47%,9%)] text-lg">Ask a question</h3>
              <button onClick={() => setShowAskModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🙌</div>
                <p className="font-bold text-[hsl(222,47%,9%)]">Question posted!</p>
                <p className="text-slate-500 text-sm mt-1">Experienced founders will see this and can answer.</p>
              </div>
            ) : (
              <>
                <textarea
                  value={askText}
                  onChange={e => setAskText(e.target.value)}
                  placeholder="What do you want to know? Be specific — good questions get better answers."
                  className="w-full h-32 p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] mb-4"
                  autoFocus
                />
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-500 mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {QA_CATEGORIES.slice(0, 8).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setAskCategory(cat)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                          askCategory === cat
                            ? 'bg-[hsl(24,95%,53%)] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!askText.trim()}
                  className="w-full py-2.5 bg-[hsl(24,95%,53%)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Post Question
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
