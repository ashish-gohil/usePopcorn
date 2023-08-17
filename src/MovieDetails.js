import { useEffect, useState } from "react";
import StarRatings from "./StarRatings";
import { ErrorBox, Loader } from "./App";

function MovieDetails({
  selectedID,
  onCloseMovie,
  onAddClick,
  existingUserRating = null,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMsg, setErrorMsg] = useState(null);
  const [userRating, setUserReting] = useState(existingUserRating);
  const {
    Title: title,
    Year: year,
    imdbRating,
    Runtime: runtime,
    Released: released,
    Plot: plot,
    Poster: poster,
    Genre: genre,
    Director: director,
    Actors: actors,
  } = movie;

  useEffect(() => {
    (async function loadMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectedID}&apikey=323d47af`
        );
        if (!res.ok) throw new Error("Something went wrong!");
        const data = await res.json();
        if (data["Response"] === "False") throw new Error(data["Error"]);
        setMovie(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      setErrorMsg(false);
    };
  }, [selectedID]);
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && !isErrorMsg && (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <StarRatings
              size={24}
              maxRating={10}
              defaultRating={existingUserRating || 0}
              onSetRating={(rating) => {
                rating !== userRating &&
                  setMovie(() => {
                    setUserReting(rating);
                    return { ...movie, userRating: rating };
                  });
              }}
            />

            <button
              className="btn btn-add"
              disabled={userRating ? false : true}
              onClick={() => onAddClick(movie)}
            >
              +Add to List
            </button>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
      {isErrorMsg && <ErrorBox errorMessage={isErrorMsg} />}
    </>
  );
}

export default MovieDetails;
