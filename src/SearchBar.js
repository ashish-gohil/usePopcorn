import { useEffect, useRef } from "react";

function SearchBar({ query, onQueryChange }) {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef.current]);
  return (
    <input
      ref={inputRef}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={onQueryChange}
    />
  );
}

export default SearchBar;
