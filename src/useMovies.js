import { useEffect, useState } from "react";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [movies, setMovies] = useState([]);

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
  return [movies, isLoading, errorMsg];
}
