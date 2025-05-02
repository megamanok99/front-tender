// entities/board/model/board.types.ts

export interface MovieResult {
  id: string; // 게시글 ID
  adult: boolean;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface Movie {
  page: number;
  total_pages: number;
  total_result: number;
  results: MovieResult[];
}
