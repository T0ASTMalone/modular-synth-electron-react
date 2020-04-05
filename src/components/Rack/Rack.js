import React, { useEffect, useState, useContext, useRef } from "react";
import "./Rack.css";
import MsContext from "../../context/MsContext";
import MainGain from "../modules/MainGain/MainGain";

const Rack = props => {
  const [loadedModules, loadModules] = useState([]);

  const context = useContext(MsContext);
  const latestContext = useRef(context);

  const { nodes, update } = context;
  const { modSettings } = props;

  // create array of current modules from nodes object
  let currentModules = [];
  Object.keys(nodes).forEach((key, i) => {
    currentModules.push(nodes[key].type);
  });

  // remove main out module (module 0)

  useEffect(() => {
    // create array of current modules from nodes array
    let currentModules = [];
    Object.keys(nodes).forEach((key, i) => {
      currentModules.push(nodes[key].type);
    });
    console.log(currentModules);

    // reduce array to only contain one of each of the current modules
    const imports = currentModules.filter(
      (item, i) => currentModules.indexOf(item) === i
    );

    const getImports = mod => {
      if (mod && mod !== "main-gain") {
        return import(`../modules/${mod}/${mod}.js`);
      }
    };

    // map over reduced array instead, in order to import only one of each module
    const importModules = mods => Promise.all(mods.map(mod => getImports(mod)));

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
      } else return undefined;
    });

    // if module was found return component
    if (loadedMod) {
      const values = modSettings ? modSettings[id] : null;
      const Module = loadedMod.default;
      return (
        <Module key={i} id={id} values={values} removeModule={removeModule} />
      );
    }
  };

  useEffect(() => {
    console.log("ran create context");
    const ctx = new AudioContext();
    latestContext.current.createCtx(ctx);
  }, [latestContext]);

  const removeModule = id => {
    context.unload(id);
  };

  let mainOutId;

  console.log(context.nodes);

  return (
    <div className='rack'>
      <div className='rack__controls'>
        {/* rack controls */}
        <button className='button'>Stop</button>
        <button className='button'>Play</button>
        <button className='button'>Rec</button>
      </div>

      <div className='rack__modules'>
        {/* 
          check if there are any current audio modules and 
          if those modules have been imported
        */}
        {currentModules && loadedModules.length > 0 ? (
          // map over current modules and render each one
          Object.keys(nodes).map((key, i) => {
            const { type } = nodes[key];
            if (type === "main-gain") {
              mainOutId = key;
            }
            return renderModule(type, i, key);
          })
        ) : (
          <></>
        )}

        {/* main output for the rack will always be loaded */}
        {context.ctx ? <MainGain newId={mainOutId} /> : <></>}
      </div>

      <div className='rack__visualAudio'>
        {/* 
          General information about the output 
          i.e. visualization of the output, spectrum analyzer, (kind of like op-1 stuff)
        */}
      </div>
    </div>
  );
};

export default Rack;
