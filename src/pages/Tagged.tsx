import { Link } from 'react-router-dom';
import { BookMarked, Compass } from 'lucide-react';
import { MOCK_PROJECTS } from '@/constants/mockData';
import { useTagAlong } from '@/hooks/useTagAlong';
import { useProjectUpdates } from '@/hooks/useProjectUpdates';
import UpdateCard from '@/components/features/UpdateCard';

export default function Tagged() {
  const { taggedProjects } = useTagAlong();
  const { getAllUpdatesForTagged } = useProjectUpdates();

  const taggedProjectsData = MOCK_PROJECTS.filter(p => taggedProjects.includes(p.id));
  const allUpdates = getAllUpdatesForTagged(taggedProjects);

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookMarked size={20} className="text-[hsl(24,95%,53%)]" />
          <h1 className="text-xl font-black text-[hsl(222,47%,9%)]">Tagged</h1>
        </div>
        <p className="text-slate-500 text-sm">Updates from projects you're tagging along with.</p>
      </div>

      {taggedProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookMarked size={28} className="text-orange-300" />
          </div>
          <h3 className="font-bold text-[hsl(222,47%,9%)] text-lg mb-2">Nothing here yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
            Tag along with businesses you want to see grow and their updates will show up here.
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(24,95%,53%)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            <Compass size={16} />
            Discover Projects
          </Link>
        </div>
      ) : (
        <div>
          {/* Projects summary strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6">
            {taggedProjectsData.map(project => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[hsl(24,95%,53%)] group-hover:scale-105 transition-transform">
                  <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-slate-600 font-medium text-center max-w-[56px] truncate">
                  {project.name}
                </span>
              </Link>
            ))}
            <Link
              to="/discover"
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-orange-300 transition-colors">
                <span className="text-slate-300 text-xl font-light group-hover:text-orange-400 transition-colors">+</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Add more</span>
            </Link>
          </div>

          {/* Updates feed */}
          {allUpdates.length > 0 ? (
            <div className="flex flex-col gap-3">
              {allUpdates.map(update => (
                <UpdateCard key={update.id} update={update} showProject={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="font-medium">No updates yet</p>
              <p className="text-sm mt-1">The projects you're following haven't posted updates yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
