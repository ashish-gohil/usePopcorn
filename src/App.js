import Box from "./Box";
import Main from "./Main";
import MovieDetails from "./MovieDetails";
import MoviesList from "./MoviesList";
import MoviesSummary from "./MoviesSummary";
import Navigation from "./Navigation";
import NumberOfResultsSummary from "./NumberOfResultsSummary";
import SearchBar from "./SearchBar";
import StarRatings from "./StarRatings";
import WatchedMoviesList from "./WatchedMoviesList";
import "./index.css";
import { useEffect, useState } from "react";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";

export function Loader() {
  return <div className="loader">Loading...</div>;
}
export function ErrorBox({ errorMessage }) {
  return <p className="error">{errorMessage}</p>;
}

export default function App() {
  const [query, setQuery] = useState("");

  const [isSelected, setIsSelected] = useState(null);
  // const apiKey = process.env.REACT_APP_OMDB_API_KEY;

  const [movies, isLoading, errorMsg] = useMovies(query);
  const [watched, setWatched] = useLocalStorage("watchedList", []);

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const movieClickHandler = (movieID) => {
    setIsSelected((selectedID) => (selectedID === movieID ? null : movieID));
  };

  const addClickHandler = ({
    imdbID,
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    userRating,
  }) => {
    setWatched((movies) => {
      const newWatched = movies.filter(
        (movie) => movie["imdbID"] !== isSelected
      );
      return [
        ...newWatched,
        {
          imdbID,
          Title,
          Year,
          Poster,
          runtime: Number(Runtime.split(" ").at(0)),
          imdbRating,
          userRating,
        },
      ];
    });
    setIsSelected(false);
  };

  const removeHandler = (removeID) => {
    setWatched((movies) => {
      return movies.filter((movie) => movie["imdbID"] !== removeID);
    });
  };

  return (
    <>
      <Navigation movies={movies}>
        <SearchBar query={query} onQueryChange={onQueryChange} />
        <NumberOfResultsSummary movies={movies} />
      </Navigation>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !errorMsg && (
            <MoviesList movies={movies} onClickHandler={movieClickHandler} />
          )}
          {errorMsg && <ErrorBox errorMessage={errorMsg} />}
        </Box>
        <Box>
          {isSelected ? (
            <MovieDetails
              selectedID={isSelected}
              onCloseMovie={() => setIsSelected(null)}
              onAddClick={addClickHandler}
              existingUserRating={
                watched.filter((el) => el.imdbID === isSelected).at(0)?.[
                  "userRating"
                ]
              }
            />
          ) : (
            <>
              <MoviesSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveHandler={removeHandler}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
