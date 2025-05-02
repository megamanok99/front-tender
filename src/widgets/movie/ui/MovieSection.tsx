"use client";

import MovieList from "@/entities/movie/ui/MovieList";
import { useFetchMovieList } from "@/features/movie/api/fetchMovie";
import React from "react";

const MovieSection = () => {
  const { data, isLoading } = useFetchMovieList();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No Movie Data</p>;

  return (
    <div>
      <h1>Movie Page</h1>
      <MovieList data={data} />
    </div>
  );
};

export default MovieSection;
