import { Heart } from 'lucide-react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onLike?: (id: string) => void;
}

export default function ProjectCard({ project, onLike }: ProjectCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-500 transition-colors">
      <Link to={`/project/${project.id}`}>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
      </Link>
      
      <div className="flex items-center justify-between">
        <Link 
          to={`/profile/${project.author.id}`}
          className="text-sm text-gray-400 hover:text-purple-500"
        >
          @{project.author.username}
        </Link>
        
        <button
          onClick={() => onLike?.(project.id)}
          className={`flex items-center space-x-1 ${
            project.isLiked ? 'text-red-500' : 'text-gray-400'
          } hover:text-red-500 transition-colors`}
        >
          <Heart className={`h-5 w-5 ${project.isLiked ? 'fill-current' : ''}`} />
          <span>{project.likes}</span>
        </button>
      </div>
    </div>
  );
}