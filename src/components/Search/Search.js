import React from "react";
import "./Search.css";

const Search = () => {
  return (
    <div className="search">
      <form action="#" className="search_modules">
        <label htmlFor="search_input">Search</label>
        <input className="search_input" type="text" placeholder="module name" />
      </form>
    </div>
  );
};

export default Search;
