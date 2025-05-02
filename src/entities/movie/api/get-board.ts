// entities/board/api/get-board.ts
import { GET } from "@/shared/api/axios";
import { Movie } from "../model/movie.types";

export const fetchMovieList = () => GET<Movie>("/movie/popular");
