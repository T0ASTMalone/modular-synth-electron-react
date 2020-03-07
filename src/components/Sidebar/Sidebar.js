import React, { useContext } from "react";
import "./Sidebar.css";

import MsContext from "../../context/MsContext";
import Explorer from "../Explorer/Explorer";

const Sidebar = () => {
  //const context = useContext(MsContext);

  //const content = context.sbContent;

  return (
    <div className='sidebar'>
      {/* <p className="test-content">{content}</p> */}
      <Explorer />
    </div>
  );
};

export default Sidebar;
