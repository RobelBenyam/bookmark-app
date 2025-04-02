export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
} 