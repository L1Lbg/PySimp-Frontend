import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Profile as ProfileType } from '@/types';
import ProjectCard from '@/components/project-card';
import { useToast } from '@/components/toast-provider';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const {showError} = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let username;
    if (id == 'me') {
      username = '0'; // in backend id of 0 means the user that made the request itself
    } else {
      username = id;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('api_url')}/api/profile/${username}`,
          {
            method: 'GET',
            headers: {
              Authorization:`Bearer ${localStorage.getItem('access')}`,
            }
          }
        );
        if (!response.ok) {
          if(response.status == 401){
            showError('You are not authorized to view this profile')
            if(id == 'me'){
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              localStorage.removeItem('username');
              localStorage.removeItem('expiry');
              navigate('/auth');
            }
          }
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        err => {
          showError(err)
        }
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">@{profile.username}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {
            profile.projects.length > 0 ? (
              <>
                {
                  profile.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                }
              
              </>
            ) : (
              <>You have no projects yet.</>
            )
          }
        </div>
      </div>
    </div>
  );
}
