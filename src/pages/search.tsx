import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Project } from '@/types';
import ProjectCard from '@/components/project-card';
import { mockProjects } from '@/data/mockData';
import { mockDataOnError } from '@/lib/utils';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProjects = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        setResults(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    searchProjects();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <SearchIcon className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold">
            Search results for "{query}"
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center text-purple-200/60">
            No projects found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}