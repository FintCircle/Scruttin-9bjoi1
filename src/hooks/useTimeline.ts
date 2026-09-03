import { useLocalStorage } from './useLocalStorage';
import type { TimelineEvent } from '@/types';
import { MOCK_PROJECTS } from '@/constants/mockData';

export function useTimeline(projectId: string) {
  const project = MOCK_PROJECTS.find(p => p.id === projectId);
  const defaultEvents = project?.timeline ?? [];

  const [events, setEvents] = useLocalStorage<TimelineEvent[]>(
    `scruttin-timeline-${projectId}`,
    defaultEvents
  );

  const addEvent = (event: TimelineEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const reorderEvents = (newOrder: TimelineEvent[]) => {
    setEvents(newOrder);
  };

  return { events, addEvent, updateEvent, deleteEvent, reorderEvents };
}
