import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/toast-provider';
import type { Project } from '@/types';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/favorites`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (projectId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/project/${projectId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: false })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      setFavorites(favorites.filter(project => project.id !== projectId));
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Heart className="h-6 w-6 text-purple-400" />
        <h1 className="text-2xl font-bold">Favorite Projects</h1>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-purple-200/60">You haven't added any projects to your favorites yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((project) => (
            <Card key={project.id} className="hover:border-purple-400/30 transition-colors">
              <CardHeader>
                <CardTitle 
                  className="cursor-pointer hover:text-purple-400"
                  onClick={() => navigate(`/create/${project.id}?editor=0`)}
                >
                  {project.title}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleRemoveFromFavorites(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from favorites
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}