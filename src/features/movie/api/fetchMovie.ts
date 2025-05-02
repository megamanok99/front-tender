import { movieQueryKeys } from "@/entities/movie/api/movie.query";
import { fetchMovieList } from "@/entities/movie/api/get-board";
import { useQuery } from "@tanstack/react-query";

export const useFetchMovieList = () => {
  return useQuery({
    queryKey: movieQueryKeys.list,
    queryFn: () => fetchMovieList(),
  });
};
