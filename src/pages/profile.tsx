import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockProfile } from '@/data/mockData';
import { Profile as ProfileType } from '@/types';
import ProjectCard from '@/components/project-card';
import { mockDataOnError } from '@/lib/utils';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    let profile_id;
    if (id == 'me') {
      profile_id = 0; // in backend id of 0 means the user that made the request itself
    } else {
      profile_id = id;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${profile_id}`
        );
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        const mock_profile: ProfileType | null =
          mockProfile.find((profile) => profile.id == profile_id) || null;

        console.log(mock_profile);
        setProfile(mock_profile);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <img
            src={`https://api.dicebear.com/7.x/avatars/svg?seed=${profile.username}`}
            alt={profile.username}
            className="w-20 h-20 rounded-full bg-purple-950"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-purple-200/60">{profile.biography}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
