import React from "react";
import { Movie, MovieResult } from "../model/movie.types";
import Link from "next/link";
import Image from "next/image";

type MovieCardProps = {
  data: MovieResult;
};

const MovieCard = ({ data }: MovieCardProps) => {
  return (
    <Link href={`/movie/${data.id}`}>
      <Image
        src={`https://image.tmdb.org/t/p/original/${data.poster_path}`}
        alt={data.title}
        width={320}
        height={480}
      />
    </Link>
  );
};

export default MovieCard;
