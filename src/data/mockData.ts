import { Project, Profile } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Automated File Organizer',
    description: 'Automatically organize your files based on type and date.',
    likes: 234,
    isLiked: false,
    isVerified: true,
    author: { id: '1', username: 'pythonmaster' },
  },
  {
    id: '2',
    title: 'Screen Recorder',
    description: 'Record your screen with custom region selection.',
    likes: 567,
    isLiked: true,
    isVerified: true,
    author: { id: '2', username: 'techwhiz' },
  },
];

export const mockProfile: Profile[] = [
  {
    id: '0',
    username: 'yourself',
    biography: 'You are only an illusion',
    projects: [
      { ...mockProjects[0], isPublic: true },
      { ...mockProjects[1], isPublic: false },
    ],
  },
  {
    id: '1',
    username: 'pythonmaster',
    biography: 'Python developer passionate about automation and AI',
    projects: [
      { ...mockProjects[0], isPublic: true },
      { ...mockProjects[1], isPublic: false },
    ],
  },
  {
    id: '2',
    username: 'pythonnoob',
    biography: 'noob',
    projects: [
      { ...mockProjects[0], isPublic: true },
      { ...mockProjects[1], isPublic: false },
    ],
  },
];