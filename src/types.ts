export interface CodeBlock {
  id: string;
  type: string;
  category: string;
  name: string;
  description: string;
  template: string;
  hasEndBlock?: boolean;
  isEndBlock?: boolean;
  parentBlockId?: string;
  inputs?: {
    name: string;
    type: string;
    default?: any;
  }[];
}

export interface BlockCategory {
  id: string;
  name: string;
  blocks: CodeBlock[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  likes: number;
  isLiked: boolean;
  isVerified?: boolean;
  author: {
    id: string;
    username: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  biography: string;
  projects: Array<Project & { isPublic: boolean }>;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
}