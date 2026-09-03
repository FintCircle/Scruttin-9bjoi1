import { useLocalStorage } from './useLocalStorage';
import { MOCK_PROJECTS } from '@/constants/mockData';

export function useTagAlong() {
  const [taggedProjects, setTaggedProjects] = useLocalStorage<string[]>(
    'scruttin-tagged-projects',
    MOCK_PROJECTS.filter(p => p.isTaggedAlong).map(p => p.id)
  );

  const isTagged = (projectId: string) => taggedProjects.includes(projectId);

  const toggleTag = (projectId: string) => {
    setTaggedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return { taggedProjects, isTagged, toggleTag };
}
