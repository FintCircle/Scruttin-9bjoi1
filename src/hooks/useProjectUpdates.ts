import { useLocalStorage } from './useLocalStorage';
import type { ProjectUpdate } from '@/types';
import { MOCK_PROJECTS } from '@/constants/mockData';

// Merge mock updates with user-posted updates
export function useProjectUpdates() {
  const [userUpdates, setUserUpdates] = useLocalStorage<ProjectUpdate[]>(
    'scruttin-user-updates',
    []
  );

  const postUpdate = (update: ProjectUpdate) => {
    setUserUpdates(prev => [update, ...prev]);
  };

  const getAllUpdatesForProject = (projectId: string): ProjectUpdate[] => {
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    const mockUpdates = project?.updates ?? [];
    const newUpdates = userUpdates.filter(u => u.projectId === projectId);
    return [...newUpdates, ...mockUpdates];
  };

  const getAllUpdatesForTagged = (taggedIds: string[]): ProjectUpdate[] => {
    const mockUpdates = MOCK_PROJECTS
      .filter(p => taggedIds.includes(p.id))
      .flatMap(p => p.updates);
    const userTaggedUpdates = userUpdates.filter(u => taggedIds.includes(u.projectId));
    return [...userTaggedUpdates, ...mockUpdates];
  };

  return { userUpdates, postUpdate, getAllUpdatesForProject, getAllUpdatesForTagged };
}
