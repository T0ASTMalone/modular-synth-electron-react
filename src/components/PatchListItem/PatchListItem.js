import React from "react";
import "./PatchListItem.css";

const PatchListItem = (props) => {
  const { item, ui, btnClick, dbClick, click, id, active } = props;

  return (
    <li
      className={
        // if ui is true or module is the main gain
        ui || item === "main-gain"
          ? // do not render x (remove button)
            "list-item list-item-no-hov active"
          : active
          ? "list-item list-item-active"
          : "list-item"
      }
      onDoubleClick={() => dbClick(item)}
      onClick={() => click(item)}
    >
      {item}
      {ui === true && <button onClick={() => btnClick(id)}>X</button>}
    </li>
  );
};

PatchListItem.defaultProps = {
  active: false,
  item: "",
  ui: false,
  btnClick: () => {},
  dbClick: () => {},
  click: () => {},
  id: "",
};

export default PatchListItem;
