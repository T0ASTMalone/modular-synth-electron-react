import React from "react";
import "./Sidebar.css";

import Search from "../Search/Search";

const Sidebar = props => {
  return (
    <div className="sidebar">
      <Search />
    </div>
  );
};

export default Sidebar;
