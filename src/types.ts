export interface CodeBlock {
  id: string;
  category: string;
  name: string;
  description: string;
  assignable: string;
  isEndBlock?: boolean;
  parentBlockId?: string;
  inputs?: Array<{
    name: string;
    type: string;
    extra?:string;
  }>;
  var_assigner:string;
  incompatible_platforms:string;
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
  favorite_count: number;
  approved?: boolean;
  username:string;
  isLiked?: boolean;
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