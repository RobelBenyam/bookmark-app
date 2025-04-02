import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

export interface CreateLinkBody {
  url: string;
  title: string;
  description?: string;
  tagIds?: string[];
}

export interface UpdateLinkBody {
  url?: string;
  title?: string;
  description?: string;
  tagIds?: string[];
}

export interface CreateTagBody {
  name: string;
}

export interface UpdateTagBody {
  name: string;
}

export interface SearchQuery {
  query?: string;
  tagIds?: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
} 