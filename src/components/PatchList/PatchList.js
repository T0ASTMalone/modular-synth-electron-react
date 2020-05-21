import React from "react";

const PatchList = (props) => {
  const { list, ui } = props;

  const renderListItem = (item, index) => {
    return (
      <li key={index}>
        {item}
        {ui === true && <button>X</button>}
      </li>
    );
  };

  return <ul>{list.map((item, i) => renderListItem(item, i))}</ul>;
};

PatchList.defaultProps = {
  list: [],
  ui: false,
};

export default PatchList;
