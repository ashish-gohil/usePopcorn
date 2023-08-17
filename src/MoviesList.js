import { useState } from "react";
import Movie from "./Movie";

function MoviesList({ movies, onClickHandler }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          onClickHandler={onClickHandler}
        />
      ))}
    </ul>
  );
}

export default MoviesList;
