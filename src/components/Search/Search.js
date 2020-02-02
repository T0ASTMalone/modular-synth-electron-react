import React from "react";
import "./Search.css";

const Search = () => {
  return (
    <div className="search">
      <form action="#" className="search_modules">
        <label className="search_label" htmlFor="search_input">
          Search
        </label>
        <div className="search_input-container">
          <input className="input" type="text" placeholder="module name" />
          <button className="search_submit">search</button>
        </div>
      </form>
    </div>
  );
};

export default Search;
