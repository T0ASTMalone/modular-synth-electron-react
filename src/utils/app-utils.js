import React, { useContext } from "react";
const { MsProvider, MsContext } = require("../context/MsContext");
const fs = require("fs");

const useSavePatch = () => {
  const context = useContext(MsContext);
  console.log(context.nodes);
};

export { useSavePatch };
