import React from "react";
import { Movie } from "../model/movie.types";
import MovieCard from "./MovieCard";

type MovieListProps = {
  data: Movie;
};

const MovieList = ({ data }: MovieListProps) => {
  const { results } = data;

  return results
    .slice(0, 10)
    .map((data) => <MovieCard data={data} key={data.id} />);
};

export default MovieList;
