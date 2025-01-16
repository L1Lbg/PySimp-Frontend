import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight, Flame, Heart } from 'lucide-react';
import { Project } from '@/types';
import ProjectCard from '@/components/project-card';
import 'swiper/css';

export default function Community() {
  const navigate = useNavigate();
  const [hot, setHot] = useState<Project[]>([]);
  const [mostLiked, setMostLiked] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${localStorage.getItem('api_url')}/api/community`);
        const data = await response.json();
        setHot(data['newest']);
        setMostLiked(data['most liked']);
      } catch (error) {
        
      }
    };

    fetchProjects();
  }, []);

  const ProjectSection = ({ title, projects, icon: Icon }: { title: string; projects: Project[]; icon: any }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
        <Icon className="h-6 w-6 text-purple-400" />
        {title}
      </h2>
      <div className="relative group">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-4"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <ProjectCard project={project} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="text-center mt-2 text-sm text-purple-200/60">
          Swipe or drag to see more projects
        </div>
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectSection title="Hot Right Now" projects={hot} icon={Flame} />
      <ProjectSection title="Most Liked" projects={mostLiked} icon={Heart} />
    </div>
  );
}