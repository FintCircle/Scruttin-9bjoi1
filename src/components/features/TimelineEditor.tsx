import { useState } from 'react';
import { X, Plus, Pencil, Trash2, GripVertical, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimeline } from '@/hooks/useTimeline';
import type { TimelineEvent } from '@/types';

const EMOJI_OPTIONS = [
  '💡', '🔎', '🛠', '👤', '💰', '🚀', '🏆', '❌', '🔄', '📦',
  '🤝', '📣', '✅', '📊', '🎯', '💬', '🧪', '🏪', '🌍', '🎉',
];

interface TimelineEditorProps {
  projectId: string;
  isOwner: boolean;
}

export default function TimelineEditor({ projectId, isOwner }: TimelineEditorProps) {
  const { events, addEvent, updateEvent, deleteEvent, reorderEvents } = useTimeline(projectId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // New event form state
  const [newEmoji, setNewEmoji] = useState('💡');
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingEmojiId, setEditingEmojiId] = useState<string | null>(null);

  // Edit state per event
  const [editValues, setEditValues] = useState<Record<string, { date: string; label: string; emoji: string }>>({});

  const startEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    setEditValues(prev => ({
      ...prev,
      [event.id]: { date: event.date, label: event.label, emoji: event.emoji },
    }));
  };

  const saveEdit = (id: string) => {
    const vals = editValues[id];
    if (vals) updateEvent(id, vals);
    setEditingId(null);
    setEditingEmojiId(null);
  };

  const handleAdd = () => {
    if (!newLabel.trim() || !newDate.trim()) return;
    addEvent({
      id: `t-${Date.now()}`,
      date: newDate,
      emoji: newEmoji,
      label: newLabel,
    });
    setNewLabel('');
    setNewDate('');
    setNewEmoji('💡');
    setShowAddForm(false);
  };

  // Drag-and-drop reorder
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...events];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dragOverIndex, 0, moved);
    reorderEvents(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[hsl(222,47%,9%)]">Timeline</h3>
        {isOwner && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-100 transition-colors border border-orange-100"
          >
            <Plus size={12} />
            Add event
          </button>
        )}
      </div>

      {/* Add form */}
      {showAddForm && isOwner && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-xl">
          <p className="text-xs font-bold text-orange-700 mb-3">New timeline event</p>
          <div className="flex items-center gap-2 mb-2">
            {/* Emoji picker trigger */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-10 h-10 rounded-lg bg-white border border-orange-200 flex items-center justify-center text-xl hover:bg-orange-100 transition-colors flex-shrink-0 relative"
            >
              {newEmoji}
            </button>
            <input
              type="text"
              placeholder="Date (e.g. Jan 2026)"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-300"
            />
          </div>
          {showEmojiPicker && (
            <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-white rounded-lg border border-orange-100">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => { setNewEmoji(e); setShowEmojiPicker(false); }}
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center text-base hover:bg-orange-50 transition-colors',
                    newEmoji === e && 'bg-orange-100 ring-1 ring-orange-300'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Event label (e.g. First paying customer)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-300 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAddForm(false); setShowEmojiPicker(false); }}
              className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim() || !newDate.trim()}
              className="flex-1 py-2 bg-[hsl(24,95%,53%)] text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-40"
            >
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Timeline list */}
      <div className="relative">
        {events.length > 1 && <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />}
        <div className="flex flex-col gap-3">
          {events.map((event, i) => (
            <div
              key={event.id}
              draggable={isOwner}
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={handleDrop}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              className={cn(
                'flex items-start gap-3 relative transition-all group',
                isOwner && 'cursor-grab active:cursor-grabbing',
                dragOverIndex === i && dragIndex !== i && 'opacity-50 scale-[0.98]'
              )}
            >
              {/* Drag handle */}
              {isOwner && (
                <div className="absolute -left-1.5 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <GripVertical size={12} className="text-slate-300" />
                </div>
              )}

              {editingId === event.id ? (
                // Editing mode
                <div className="flex-1 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setEditingEmojiId(editingEmojiId === event.id ? null : event.id)}
                      className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-xl hover:bg-blue-50 transition-colors flex-shrink-0"
                    >
                      {editValues[event.id]?.emoji || event.emoji}
                    </button>
                    <input
                      type="text"
                      value={editValues[event.id]?.date ?? ''}
                      onChange={e => setEditValues(prev => ({ ...prev, [event.id]: { ...prev[event.id], date: e.target.value } }))}
                      placeholder="Date"
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  {editingEmojiId === event.id && (
                    <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-white rounded-lg border border-blue-100">
                      {EMOJI_OPTIONS.map(e => (
                        <button
                          key={e}
                          onClick={() => {
                            setEditValues(prev => ({ ...prev, [event.id]: { ...prev[event.id], emoji: e } }));
                            setEditingEmojiId(null);
                          }}
                          className={cn(
                            'w-8 h-8 rounded-md flex items-center justify-center text-base hover:bg-blue-50 transition-colors',
                            editValues[event.id]?.emoji === e && 'bg-blue-100 ring-1 ring-blue-300'
                          )}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={editValues[event.id]?.label ?? ''}
                    onChange={e => setEditValues(prev => ({ ...prev, [event.id]: { ...prev[event.id], label: e.target.value } }))}
                    placeholder="Event label"
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 mb-2"
                    onKeyDown={e => e.key === 'Enter' && saveEdit(event.id)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(null)} className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg">
                      Cancel
                    </button>
                    <button onClick={() => saveEdit(event.id)} className="flex-1 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
                      <Check size={11} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-orange-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10 text-lg select-none">
                    {event.emoji}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs text-slate-400 font-medium">{event.date}</p>
                    <p className="text-sm font-semibold text-[hsl(222,47%,9%)]">{event.label}</p>
                  </div>
                  {isOwner && (
                    <div className="flex items-center gap-1 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => startEdit(event)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">No timeline events yet.</p>
          {isOwner && (
            <button onClick={() => setShowAddForm(true)} className="text-[hsl(24,95%,53%)] text-xs font-medium mt-2 hover:underline">
              Add your first milestone →
            </button>
          )}
        </div>
      )}

      {isOwner && events.length > 1 && (
        <p className="text-[10px] text-slate-300 mt-3 text-center">Drag events to reorder</p>
      )}
    </div>
  );
}
