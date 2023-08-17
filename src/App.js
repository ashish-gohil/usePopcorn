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

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
export function Loader() {
  return <div className="loader">Loading...</div>;
}
export function ErrorBox({ errorMessage }) {
  return <p className="error">{errorMessage}</p>;
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    return JSON.parse(localStorage.getItem("watchedList")) || [];
  });
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [isSelected, setIsSelected] = useState(null);
  // const apiKey = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    const controller = new AbortController();
    (async function () {
      setIsLoading(true);
      try {
        if (query.trim().length <= 3) {
          throw new Error("Enter atleast 4 characters to see results");
        }

        const res = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=323d47af`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        if (data["Response"] === "False") throw new Error(data["Error"]);

        createMoviesList(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      setErrorMsg(false);
      setMovies([]);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    localStorage.setItem("watchedList", JSON.stringify(watched));
  }, [watched]);

  function createMoviesList(movies) {
    const randeredMovies = movies.map(({ imdbID, Title, Year, Poster }) => {
      return {
        imdbID,
        Title,
        Year,
        Poster,
      };
    });
    setMovies(randeredMovies);
  }

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
