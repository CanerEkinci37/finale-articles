import { UserRead } from "./User";

export interface ArticleCreate {
  title: string;
  content: string;
}

export interface ArticleRead {
  id: string;
  title: string;
  content: string;
  author: UserRead;
  created_at: string;
  updated_at: string;
}

export interface ArticleUpdate {
  title: string;
  content: string
}