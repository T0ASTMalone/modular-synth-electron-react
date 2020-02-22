import React, { useEffect, useState, useContext } from "react";
import "./Rack.css";
import MsContext from "../../context/MsContext";

const Rack = () => {
  const [loadedModules, loadModules] = useState([]);
  //const [currentModules, setCurrentModules] = useState([]);

  const context = useContext(MsContext);

  useEffect(() => {
    const currentModules = context.loaded;
    // reduce array to only contain one of each of the current modules
    const imports = currentModules.filter(
      (item, i) => currentModules.indexOf(item) === i
    );

    const importModules = mods =>
      // map over reduced array instead, in order to import only one of each module
      Promise.all(mods.map(mod => import(`../modules/${mod}/${mod}.js`)));

    importModules(imports).then(loadedModules => {
      loadModules(loadedModules);
    });
  }, [context.loaded.length]);

  // useState to hold current modules array
  // map over current modules in state instead of loaded modules

  const currentModules = context.loaded;

  return (
    <div className='rack'>
      <div className='rack__controls'>
        {/* rack controls */}
        <button>Stop</button>
        <button>Play</button>
        <button>Rec</button>
      </div>

      <div className='rack__modules'>
        {currentModules.length > 0 && loadedModules.length > 0 ? (
          currentModules.map((name, i) => {
            const loadedMod = loadedModules.find(mod => {
              return mod.default.name === name;
            });
            if (loadedMod) {
              const Module = loadedMod.default;
              return <Module key={i} />;
            }
          })
        ) : (
          <></>
        )}
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
