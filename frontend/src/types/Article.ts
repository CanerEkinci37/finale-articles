export interface Article {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: string;
    updated_at: string;
  }
  
export interface CreateArticleDto {
title: string;
content: string;
}

export interface UpdateArticleDto {
title?: string;
content?: string;
}

