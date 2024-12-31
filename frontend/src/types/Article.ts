import { UserRead } from "./User";

export interface ArticleRead {
  id: string;
  title: string;
  content: string;
  author: UserRead;
  created_at: Date;
  updated_at: Date;
}
