import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Project } from '@/types';
import { STAGE_COLORS } from '@/constants/mockData';
import TagAlongButton from './TagAlongButton';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured';
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        to={`/project/${project.id}`}
        className="block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
      >
        <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
          <img
            src={project.logo}
            alt={project.name}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STAGE_COLORS[project.stage]}`}>
              {project.stage}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <img
              src={project.logo}
              alt={project.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm -mt-8 flex-shrink-0"
            />
            <div className="pt-1 min-w-0">
              <h3 className="font-bold text-[hsl(222,47%,9%)] text-base leading-tight truncate">{project.name}</h3>
              <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                <MapPin size={10} />
                {project.location}
              </p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">{project.tagline}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{project.industry}</span>
            <TagAlongButton projectId={project.id} tagAlongCount={project.tagAlongCount} size="sm" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/project/${project.id}`}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 group"
    >
      <img
        src={project.logo}
        alt={project.name}
        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-[hsl(222,47%,9%)] text-sm leading-tight truncate">{project.name}</h3>
            <p className="text-slate-500 text-xs mt-0.5 truncate">{project.tagline}</p>
          </div>
          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STAGE_COLORS[project.stage]}`}>
            {project.stage}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400">{project.location} · {project.industry}</span>
          <TagAlongButton projectId={project.id} tagAlongCount={project.tagAlongCount} size="sm" />
        </div>
      </div>
    </Link>
  );
}
