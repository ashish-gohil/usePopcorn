function Movie({ movie, onClickHandler }) {
  return (
    <li key={movie.imdbID} onClick={() => onClickHandler(movie.imdbID)}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onError={(e) => {
          e.preventDefault();
          console.log(e.target);
          e.target.src =
            "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
        }}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

export default Movie;
