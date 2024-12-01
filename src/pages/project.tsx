import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeCheck, Heart, Copy, Download, Code2 } from 'lucide-react';
import { Project as ProjectType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockProjects } from '@/data/mockData';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setProject(mockProjects.find(p => p.id === id) || mockProjects[0]);
      }
    };

    fetchProject();
  }, [id]);

  const handleFork = () => {
    // Implementation for forking projects
  };

  const handleDownload = () => {
    // Implementation for downloading projects
  };

  const handleViewCode = () => {
    navigate(`/new?editor=0`);
  };

  if (!project) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            {project.isVerified && (
              <BadgeCheck className="h-6 w-6 text-blue-400" />
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleViewCode}
              className="space-x-2"
            >
              <Code2 className="h-4 w-4" />
              <span>View Code</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFork}
              className="space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Fork</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDownload}
              className="space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        <p className="text-purple-200/60 mb-8">{project.description}</p>

        {project.code && (
          <Card className="mb-8">
            <pre className="p-6 text-purple-50 overflow-x-auto">
              <code>{project.code.join('\n')}</code>
            </pre>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/avatars/svg?seed=${project.author.username}`}
              alt={project.author.username}
              className="w-8 h-8 rounded-full bg-purple-950"
            />
            <span className="text-purple-200/60">@{project.author.username}</span>
          </div>

          <Button
            variant="ghost"
            className={`space-x-2 ${
              project.isLiked ? 'text-red-400' : 'text-purple-200/60'
            }`}
          >
            <Heart className={`h-5 w-5 ${project.isLiked ? 'fill-current' : ''}`} />
            <span>{project.likes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}