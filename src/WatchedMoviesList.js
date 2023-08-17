import { useEffect } from "react";
import MoviesSummary from "./MoviesSummary";
import WatchedMovie from "./WatchedMovie";

function WatchedMoviesList({ watched, onRemoveHandler }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveMovie={onRemoveHandler}
        />
      ))}
    </ul>
  );
}

export default WatchedMoviesList;
