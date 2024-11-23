import { Link } from 'react-router-dom';
import { Heart, Lock, Unlock } from 'lucide-react';
import { Project } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';

interface ProjectCardProps {
  project: Project & { isPublic?: boolean };
  onLike?: (id: string) => void;
}

export default function ProjectCard({ project, onLike }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{project.title}</CardTitle>
          {'isPublic' in project && (
            <div className="text-sm">
              {project.isPublic ? (
                <Unlock className="h-4 w-4 text-green-400" />
              ) : (
                <Lock className="h-4 w-4 text-yellow-400" />
              )}
            </div>
          )}
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between">
        <Link
          to={`/profile/${project.author.id}`}
          className="text-sm text-purple-200/60 hover:text-purple-200"
        >
          @{project.author.username}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike?.(project.id)}
          className={project.isLiked ? 'text-red-400' : 'text-purple-200/60'}
        >
          <Heart className={`h-4 w-4 mr-1 ${project.isLiked ? 'fill-current' : ''}`} />
          {project.likes}
        </Button>
      </CardFooter>
    </Card>
  );
}