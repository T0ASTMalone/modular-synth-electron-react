import React, { Component } from "react";
import shortid from "shortid";
import randomColor from "randomcolor";

const MsContext = React.createContext({
  error: null,
  update: false,
  updateCables: false,
  ctx: null,
  mediaStreamDestination: null,
  tmpPathobj: {},
  rootPath: "",
  nodes: {},
  cables: {},
  input: null,
  output: null,
  sidebar: null,
  sbContent: "",
  loaded: [],
  isExisting: false,
  createContext: () => {},
  setMediaStreamDestination: () => {},
  addNode: () => {},
  createInput: () => {},
  createOutput: () => {},
  removeInput: () => {},
  removeOutput: () => {},
  load: () => {},
  loadPatch: () => {},
  loadPatchCables: () => {},
  unload: () => {},
  setSbContent: () => {},
  toggleSidebar: () => {},
  getCurrentState: () => {},
  clearContext: () => {},
  setRootPath: () => {},
  setTmpobj: () => {},
});

export default MsContext;

export class MsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctx: null,
      nodes: {},
      cables: {},
      input: null,
      output: null,
      error: null,
      update: false,
      updateCables: false,
      sidebar: false,
      sbContent: "",
      loaded: [],
      tmpPathobj: {},
      rootPath: "",
      isExisting: false,
    };
  }
  /**
   * Set Audio Context
   * @param {AudioContext} ctx
   */
  createCtx = (ctx) => {
    this.setState({ ctx });
  };

  /**
   * true : if current project is an existing saved project
   *
   * false : if current project is a new project
   * @param {boolean} isExisting
   */
  setIsExisting = (isExisting) => {
    this.setState({ isExisting });
  };

  /**
   * Add audio node to nodes object and trigger update by updating the
   * updateCablesvalue
   * @param {string} id
   * @param {AudioNode} audioNode
   */
  addNode = (id, audioNode) => {
    const { nodes, updateCables } = this.state;
    nodes[id].node = audioNode;
    // futer miguel doesn't get why I am updating cables here
    this.setState({ nodes, updateCables: !updateCables });
  };

  /**
   * Sets mediaStreamDestination for recording application audio
   * @param {MediaStreamAudioDestinationNode} mediaStreamDestination
   */
  setMediaStreamDestination = (mediaStreamDestination) => {
    this.setState({ mediaStreamDestination });
  };

  /**
   * Sets tmp object that has the name (path) of the dir and a clean up
   * function that will delete the tmp dir
   * @param {{name: string removeCallback: Function}} tmpPathobj
   */
  setTmpobj = (tmpPathobj) => {
    console.log(tmpPathobj);
    this.setState({ tmpPathobj });
  };

  /**
   * sets root path for current project
   * @param {string} rootPath
   */
  setRootPath = (rootPath) => {
    this.setState({ rootPath });
  };

  /**
   * loads module that was selected from sidebar
   * @param {string} type (module time (i.e. Oscillator, Lfo etc...))
   * @param {int} id : optional module id
   */
  // pass in type and id (id is optional)
  load = (type, id) => {
    // get nodes object and update from state
    const { nodes, update } = this.state;
    // if id  is not passed in
    if (!id) {
      // create id
      id = shortid.generate();
    }
    // create property in nodes module with the id as the key and properties of type and node
    // type being the type passed in and node being the audio node
    // the audio node will be null until the module is loaded and the node is created by
    // the module
    nodes[id] = {
      type,
      node: null,
    };
    // update state
    this.setState({ nodes, update: !update });
    return id;
  };

  /**
   * returns any inputs to the node with the id that is passe din
   * @param {int} id
   */
  _findInputs = (id) => {
    const { cables } = this.state;

    const inputs = [];

    for (let key in cables) {
      if (cables[key].mod === id) {
        inputs.push(key);
      }
    }
    return inputs;
  };

  /**
   * removes module from rack by id
   * @param {int} id
   */
  unload = (id) => {
    console.log("ran with id: ", id);
    const { nodes, update, cables, updateCables } = this.state;

    // remove any connections that have
    // the module being deleted as an input or output
    const inputs = this._findInputs(id);

    // remove connections with this mod as an input
    inputs.forEach((input) => {
      delete cables[input];
    });

    // remove connections with this mod as an output
    delete cables[id];

    nodes[id].node.disconnect();

    // delete node
    delete nodes[id];
    // update
    this.setState({ nodes, update: !update, updateCables: !updateCables });
  };

  /**
   * load modules from saved patch into context
   * @param {[{id: int, type: string}]} mods
   */
  loadPatch = (mods) => {
    let { nodes, update } = this.state;
    let { mainOutId, mainOut } = this._findMainOut();
    // delete any loaded modules
    nodes = {};

    // set saved modules to nodes obj
    for (let k in mods) {
      const { id, type } = mods[k];
      if (type !== "main-gain") {
        nodes[id] = {
          type,
          node: null,
        };
      } else {
        mainOutId = id;
      }
    }

    // add main out to nodes obj
    nodes[mainOutId] = mainOut;
    // load modules
    this.setState({ nodes, update: !update });
  };

  /**
   * load cables (inputs and outputs) from saved patch
   * @param {{[outputId]: {color: string, mod: string, input: string}}} savedCables
   */
  loadPatchCables = (savedCables) => {
    this.setState({ cables: savedCables });
  };

  /**
   * change what content is rendered in the sidebar
   * posible values for sb content
   * @param {string} sbContent
   */
  setSbContent = (sbContent) => {
    this.setState({ sbContent });
  };

  /**
   * toggle sidebar
   */
  toggleSidebar = () => {
    const sidebar = this.state.sidebar;
    this.setState({
      sidebar: !sidebar,
    });
  };

  /**
   * Create cable that represents routing one modules output signal to anothers
   * main input or to one of its audio parameters.
   *
   * Example routing:
   *
   * Oscillator output -> Filter input
   *
   * Lfo output -> Oscillator frequency parameter
   *
   * @param {string} input
   * @param {string} output
   */
  _createConnection = (input, output) => {
    const { cables, updateCables } = this.state;
    cables[output] = input;

    this.setState({
      cables,
      input: null,
      output: null,
      updateCables: !updateCables,
    });
  };

  /**
   * Create input and asign color to input that will be used to represent the
   * connection. If an output has been selected, a connection is created by
   * calling this._createConnection(input, output).
   * @param {string} mod
   * @param {string} inputId
   */
  createInput = (mod, inputId) => {
    const { output } = this.state;
    const color = randomColor();

    const input = {
      color,
      mod,
      input: inputId,
    };

    this.setState({ input });

    if (output && output !== input.mod) {
      this._createConnection(input, output);
    }
  };

  /**
   * Create output and if an input has already been selected calls
   * this._createConnection(input, output)
   * @param {string} output
   */
  createOutput = (output) => {
    const { input } = this.state;
    this.setState({ output });

    if (input && output !== input.mod) {
      this._createConnection(input, output);
    }
  };

  /**
   * Remove cable (disconnect modules) and replace ouput from cable in conntext
   * to wait for a valid input to be selected or until the output is changed
   * for another.
   *
   * @param {string} mod
   * @param {string} inputId
   */
  removeInput = (mod, inputId) => {
    const { cables, updateCables } = this.state;
    // find cable with mod and with input id as the input
    const output = Object.keys(cables).find(
      (key) => cables[key].mod === mod && cables[key].input === inputId
    );
    // remove cable
    delete cables[output];
    // set remaining output from cable as the ouput in context
    this.setState({ cables, input: null, output, updateCables: !updateCables });
  };

  /**
   * Remove cable (disconnect modules) and replace input from cable in conntext
   * to wait for a valid input to be selected or until the output is changed
   * for another.
   * @param {string} id
   */
  removeOutput = (id) => {
    const { cables, updateCables } = this.state;
    const input = cables[id];
    delete cables[id];
    this.setState({ cables, input, output: null, updateCables: !updateCables });
  };

  /**
   * Returns the main output for the rack and its id
   * @return mainOutId, mainOut (AudioNode)
   */
  _findMainOut = () => {
    // find main out
    let { nodes } = this.state;
    let mainOut;
    let mainOutId;
    for (let k in nodes) {
      if (nodes[k].type === "main-gain") {
        mainOut = nodes[k];
        mainOutId = k;
      }
    }
    return { mainOutId, mainOut };
  };

  /**
   * Remove anything that is connected to the main output
   */
  _removeLastCable = () => {
    const { nodes, cables } = this.state;
    // iterate over cables
    for (let k in cables) {
      // if there is a connection to main out
      if (cables[k].input === "main-in") {
        // disconnect what ever was connected
        nodes[k].node.disconnect();
      }
    }
  };

  /**
   * Reset everything to its zero value (new patch)
   */
  clearContext = () => {
    // disconect what ever is connected to main out node
    this._removeLastCable();

    // get main out id and node
    const { id, mainOut } = this._findMainOut();

    // delete audio nodes
    const nodes = {};

    // recycle main out
    nodes[id] = mainOut;

    const { tmpPathobj } = this.state;

    tmpPathobj.removeCallback();
    // update context
    this.setState({
      nodes,
      cables: {},
      input: null,
      output: null,
      error: null,
      update: false,
      updateCables: false,
      sidebar: false,
      sbContent: "",
      loaded: [],
      tmpPathobj: {},
    });
  };

  /**
   *
   * For use in useEffect hook when a ref to context is used to prevent
   * triggering useEffect when context is updated and the context being
   * referenced is outdated. This method will return the most updated values
   * in context
   */
  getCurrentState = () => {
    const { nodes, cables, tmpPathobj, isExisting, rootPath } = this.state;
    return { nodes, cables, tmpPathobj, isExisting, rootPath };
  };

  render() {
    const value = {
      // state
      ctx: this.state.ctx,
      mediaStreamDestination: this.state.mediaStreamDestination,
      nodes: this.state.nodes,
      cables: this.state.cables,
      error: this.state.error,
      sidebar: this.state.sidebar,
      sbContent: this.state.sbContent,
      loaded: this.state.loaded,
      update: this.state.update,
      updateCables: this.state.updateCables,
      tmpPathobj: this.state.tmpPathobj,
      rootPath: this.state.rootPath,
      isExisting: this.state.isExisting,

      //output only for testing
      output: this.state.output,
      input: this.state.input,

      // methods
      createCtx: this.createCtx,
      setMediaStreamDestination: this.setMediaStreamDestination,
      addNode: this.addNode,
      createInput: this.createInput,
      createOutput: this.createOutput,
      removeInput: this.removeInput,
      removeOutput: this.removeOutput,
      load: this.load,
      loadPatch: this.loadPatch,
      loadPatchCables: this.loadPatchCables,
      unload: this.unload,
      setSbContent: this.setSbContent,
      toggleSidebar: this.toggleSidebar,
      getCurrentState: this.getCurrentState,
      clearContext: this.clearContext,
      setTmpobj: this.setTmpobj,
      setRootPath: this.setRootPath,
      setIsExisting: this.setIsExisting,
    };

    return (
      <MsContext.Provider value={value}>
        {this.props.children}
      </MsContext.Provider>
    );
  }
}
