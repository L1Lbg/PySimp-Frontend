import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/community`);
        const data = await response.json();
        setHot(data['newest']);
        setMostLiked(data['most liked']);
      } catch (error) {
        
      }
    };

    fetchProjects();
  }, []);

  const ProjectSection = ({ title, projects }: { title: string; projects: Project[] }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
        {title}
      </h2>
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
          <SwiperSlide key={project.id} className="cursor-pointer">
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectSection title="Hot Right Now" projects={hot} />
      <ProjectSection title="Most Liked" projects={mostLiked} />
    </div>
  );
}