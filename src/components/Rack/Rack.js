import React, { useEffect, useState, useContext } from "react";
import "./Rack.css";
import MsContext from "../../context/MsContext";
import MainGain from "../modules/MainGain/MainGain";

const Rack = props => {
  const [loadedModules, loadModules] = useState([]);

  const context = useContext(MsContext);

  const { nodes, update } = context;
  const { modSettings } = props;

  // create array of current modules from nodes object
  let currentModules = Object.keys(nodes).map((key, i) => {
    if (i > 0) {
      return nodes[key].type;
    }
  });
  // remove main out module (module 0)
  currentModules.shift();

  useEffect(() => {
    // create array of current modules from nodes array
    let currentModules = Object.keys(nodes).map((key, i) => {
      if (i > 0) {
        return nodes[key].type;
      }
    });

    currentModules.shift();

    // reduce array to only contain one of each of the current modules
    const imports = currentModules.filter(
      (item, i) => currentModules.indexOf(item) === i
    );

    const importModules = mods =>
      // map over reduced array instead, in order to import only one of each module
      Promise.all(
        mods.map(mod => {
          if (mod) {
            return import(`../modules/${mod}/${mod}.js`);
          }
        })
      );

    // add imports to state as loaded modules for rendering
    importModules(imports).then(loadedModules => {
      loadModules(loadedModules);
    });
  }, [update]);

  const renderModule = (name, i, id) => {
    // get imported module by searching loadedModules for file with the same name
    const loadedMod = loadedModules.find(mod => {
      if (mod) {
        return mod.default.name === name;
      }
    });
    // if module was found return component
    if (loadedMod) {
      const Module = loadedMod.default;
      return <Module key={i} index={i} id={id} removeModule={removeModule} />;
    }
  };

  useEffect(() => {
    const ctx = new AudioContext();

    context.createCtx(ctx);
  }, []);

  const removeModule = id => {
    console.log("ran remove module");
    context.unload(id);
  };

  return (
    <div className="rack">
      <div className="rack__controls">
        {/* rack controls */}
        <button className="button">Stop</button>
        <button className="button">Play</button>
        <button className="button">Rec</button>
      </div>

      <div className="rack__modules">
        {/* 
          check if there are any current audio modules and 
          if those modules have been imported
        */}
        {currentModules && loadedModules.length > 0 ? (
          // map over current modules and render each one
          Object.keys(nodes).map((key, i) => {
            const { type } = nodes[key];
            return renderModule(type, i, key);
          })
        ) : (
          <></>
        )}

        {/* main output for the rack will always be loaded */}
        {context.ctx ? <MainGain /> : <></>}
      </div>

      <div className="rack__visualAudio">
        {/* 
          General information about the output 
          i.e. visualization of the output, spectrum analyzer, (kind of like op-1 stuff)
        */}
      </div>
    </div>
  );
};

export default Rack;
